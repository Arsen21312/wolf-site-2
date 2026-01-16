import { useState, useEffect } from 'react';
import { Moon, Sun, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Slider } from '@/app/components/ui/slider';
import { Label } from '@/app/components/ui/label';

interface SleepSession {
  id: string;
  startTime: string;
  endTime: string | null;
  quality: number;
  date: string;
}

interface SleepTrackerProps {
  onSleepUpdate: () => void;
}

export function SleepTracker({ onSleepUpdate }: SleepTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<SleepSession | null>(null);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    // Check if there's an active session in localStorage
    const activeSession = localStorage.getItem('activeSleepSession');
    if (activeSession) {
      const session = JSON.parse(activeSession);
      setCurrentSession(session);
      setIsTracking(true);
    }
  }, []);

  useEffect(() => {
    if (!isTracking || !currentSession) return;

    const interval = setInterval(() => {
      const start = new Date(currentSession.startTime);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, currentSession]);

  const startSleep = () => {
    const session: SleepSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      endTime: null,
      quality: 3,
      date: new Date().toISOString().split('T')[0],
    };
    
    setCurrentSession(session);
    setIsTracking(true);
    localStorage.setItem('activeSleepSession', JSON.stringify(session));
  };

  const endSleep = () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      quality: sleepQuality,
    };

    // Save to sleep history
    const history = JSON.parse(localStorage.getItem('sleepHistory') || '[]');
    history.push(updatedSession);
    localStorage.setItem('sleepHistory', JSON.stringify(history));
    
    // Clear active session
    localStorage.removeItem('activeSleepSession');
    setCurrentSession(null);
    setIsTracking(false);
    setSleepQuality(3);
    setElapsedTime('00:00:00');
    
    onSleepUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isTracking ? (
            <>
              <Moon className="w-5 h-5" />
              Sleeping...
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              Sleep Tracker
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isTracking ? 'Track your current sleep session' : 'Start tracking your sleep'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isTracking ? (
          <>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <div className="text-4xl font-mono">{elapsedTime}</div>
                <p className="text-sm text-gray-500 mt-2">Time asleep</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rate your sleep quality (1-5)</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Poor</span>
                  <Slider
                    value={[sleepQuality]}
                    onValueChange={(value) => setSleepQuality(value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">Excellent</span>
                </div>
                <div className="text-center text-2xl font-semibold">{sleepQuality}/5</div>
              </div>
            </div>
            
            <Button onClick={endSleep} className="w-full" variant="default">
              <Sun className="w-4 h-4 mr-2" />
              Wake Up
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Moon className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
              <p className="text-gray-600">Ready to track your sleep?</p>
            </div>
            <Button onClick={startSleep} className="w-full" variant="default">
              <Moon className="w-4 h-4 mr-2" />
              Start Sleep
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
