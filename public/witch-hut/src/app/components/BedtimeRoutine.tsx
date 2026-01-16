import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';

interface RoutineItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

const DEFAULT_ROUTINES: Omit<RoutineItem, 'id' | 'completed'>[] = [
  { text: 'Dim the lights', order: 1 },
  { text: 'Put away electronics', order: 2 },
  { text: 'Take a warm shower', order: 3 },
  { text: 'Read a book', order: 4 },
  { text: 'Meditation or breathing exercises', order: 5 },
  { text: 'Set alarm for tomorrow', order: 6 },
];

export function BedtimeRoutine() {
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [newRoutine, setNewRoutine] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bedtimeRoutines');
    if (saved) {
      setRoutines(JSON.parse(saved));
    } else {
      // Initialize with default routines
      const defaultRoutines = DEFAULT_ROUTINES.map((r) => ({
        id: Date.now().toString() + Math.random(),
        text: r.text,
        completed: false,
        order: r.order,
      }));
      setRoutines(defaultRoutines);
      localStorage.setItem('bedtimeRoutines', JSON.stringify(defaultRoutines));
    }
  }, []);

  const saveRoutines = (updatedRoutines: RoutineItem[]) => {
    setRoutines(updatedRoutines);
    localStorage.setItem('bedtimeRoutines', JSON.stringify(updatedRoutines));
  };

  const toggleRoutine = (id: string) => {
    const updated = routines.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    saveRoutines(updated);
  };

  const addRoutine = () => {
    if (!newRoutine.trim()) return;
    
    const routine: RoutineItem = {
      id: Date.now().toString(),
      text: newRoutine,
      completed: false,
      order: routines.length + 1,
    };
    
    saveRoutines([...routines, routine]);
    setNewRoutine('');
  };

  const deleteRoutine = (id: string) => {
    const updated = routines.filter((r) => r.id !== id);
    saveRoutines(updated);
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (!editText.trim() || !editingId) return;
    
    const updated = routines.map((r) =>
      r.id === editingId ? { ...r, text: editText } : r
    );
    saveRoutines(updated);
    setEditingId(null);
    setEditText('');
  };

  const resetRoutines = () => {
    const reset = routines.map((r) => ({ ...r, completed: false }));
    saveRoutines(reset);
  };

  const completedCount = routines.filter((r) => r.completed).length;
  const progress = routines.length > 0 ? (completedCount / routines.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bedtime Routine</CardTitle>
            <CardDescription>
              {completedCount} of {routines.length} completed
            </CardDescription>
          </div>
          {completedCount > 0 && (
            <Button variant="outline" size="sm" onClick={resetRoutines}>
              Reset
            </Button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <Checkbox
                checked={routine.completed}
                onCheckedChange={() => toggleRoutine(routine.id)}
                id={routine.id}
              />
              
              {editingId === routine.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={saveEdit}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor={routine.id}
                    className={`flex-1 cursor-pointer ${
                      routine.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {routine.text}
                  </label>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(routine.id, routine.text)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteRoutine(routine.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Input
            placeholder="Add new routine..."
            value={newRoutine}
            onChange={(e) => setNewRoutine(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRoutine()}
          />
          <Button onClick={addRoutine} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
