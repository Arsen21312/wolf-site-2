import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Moon, TrendingUp, Clock, Star } from 'lucide-react';

interface SleepSession {
  id: string;
  startTime: string;
  endTime: string | null;
  quality: number;
  date: string;
}

interface SleepAnalyticsProps {
  refreshKey: number;
}

export function SleepAnalytics({ refreshKey }: SleepAnalyticsProps) {
  const [sleepData, setSleepData] = useState<SleepSession[]>([]);
  const [stats, setStats] = useState({
    avgHours: 0,
    avgQuality: 0,
    totalSessions: 0,
    bestSleep: 0,
  });

  useEffect(() => {
    loadSleepData();
  }, [refreshKey]);

  const loadSleepData = () => {
    const history = JSON.parse(localStorage.getItem('sleepHistory') || '[]');
    setSleepData(history);
    calculateStats(history);
  };

  const calculateStats = (data: SleepSession[]) => {
    if (data.length === 0) {
      setStats({ avgHours: 0, avgQuality: 0, totalSessions: 0, bestSleep: 0 });
      return;
    }

    const totalHours = data.reduce((sum, session) => {
      if (!session.endTime) return sum;
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const totalQuality = data.reduce((sum, session) => sum + session.quality, 0);
    const bestSleep = Math.max(...data.map(s => {
      if (!s.endTime) return 0;
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }));

    setStats({
      avgHours: totalHours / data.length,
      avgQuality: totalQuality / data.length,
      totalSessions: data.length,
      bestSleep: bestSleep,
    });
  };

  const getChartData = () => {
    return sleepData
      .filter(s => s.endTime)
      .slice(-7)
      .map(session => {
        const start = new Date(session.startTime);
        const end = new Date(session.endTime!);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const date = new Date(session.date);
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          hours: parseFloat(hours.toFixed(1)),
          quality: session.quality,
        };
      });
  };

  const chartData = getChartData();

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return '#10b981';
    if (quality >= 3) return '#3b82f6';
    if (quality >= 2) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Sleep
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Avg Quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgQuality.toFixed(1)}/5
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Total Sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSessions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Best Sleep
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.bestSleep.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sleep Trends</CardTitle>
          <CardDescription>Last 7 sleep sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <Moon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No sleep data yet</p>
                <p className="text-sm">Start tracking to see your analytics</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="hours" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hours">Sleep Duration</TabsTrigger>
                <TabsTrigger value="quality">Sleep Quality</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hours" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="quality" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} label={{ value: 'Quality', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="quality" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep History</CardTitle>
          <CardDescription>Recent sleep sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {sleepData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Moon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sleep history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sleepData
                .slice()
                .reverse()
                .slice(0, 10)
                .map((session) => {
                  const start = new Date(session.startTime);
                  const end = session.endTime ? new Date(session.endTime) : null;
                  const hours = end 
                    ? ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1)
                    : 'In progress';

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium">
                          {start.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {start.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {end && ` - ${end.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{hours}h</div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 fill-current" style={{ color: getQualityColor(session.quality) }} />
                            <span>{session.quality}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
