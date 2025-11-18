import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { HALTCheck } from '@/components/HALTCheck';
import { EmptyState } from '@/components/EmptyState';
import { JournalScreenSkeleton } from '@/components/LoadingSkeletons';
import { AlertTriangle, TrendingUp, Target, Heart, Plus, Trash2, Users } from 'lucide-react';
import { TRIGGER_TYPES, MEDITATION_TYPES } from '@/types/app';
import type { HALTCheck as HALTCheckType } from '@/types/app';
import { formatDate } from '@/lib/utils-app';
import { toast } from 'sonner';

export function JournalScreen() {
  const {
    cravings,
    setCravings,
    meetings,
    setMeetings,
    growthLogs,
    setGrowthLogs,
    challenges,
    setChallenges,
    gratitude,
    setGratitude,
    meditations,
    setMeditations,
    loading,
    celebrationsEnabled
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('cravings');

  // Craving state
  const [showAddCraving, setShowAddCraving] = useState(false);
  const [newCraving, setNewCraving] = useState({
    intensity: 5,
    trigger: 'Stress',
    triggerNotes: '',
    copingStrategy: '',
    overcame: false
  });
  const [showHALTInCraving, setShowHALTInCraving] = useState(false);
  const [cravingHaltData, setCravingHaltData] = useState<HALTCheckType | null>(null);

  // Meeting state
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    type: 'AA',
    location: '',
    notes: ''
  });

  // Growth log state
  const [showAddGrowth, setShowAddGrowth] = useState(false);
  const [newGrowth, setNewGrowth] = useState({
    title: '',
    description: ''
  });

  // Challenge state
  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    situation: '',
    response: '',
    outcome: ''
  });

  // Gratitude state
  const [showAddGratitude, setShowAddGratitude] = useState(false);
  const [newGratitudeEntry, setNewGratitudeEntry] = useState('');

  // Meditation state
  const [showAddMeditation, setShowAddMeditation] = useState(false);
  const [newMeditation, setNewMeditation] = useState({
    duration: 10,
    type: 'Mindfulness',
    notes: ''
  });

  const handleAddCraving = () => {
    setCravings([...cravings, {
      id: Date.now(),
      date: new Date().toISOString(),
      ...newCraving,
      halt: cravingHaltData || undefined
    }]);
    setShowAddCraving(false);
    setNewCraving({ intensity: 5, trigger: 'Stress', triggerNotes: '', copingStrategy: '', overcame: false });
    setShowHALTInCraving(false);
    setCravingHaltData(null);

    // Show success message
    if (newCraving.overcame) {
      toast.success('Great job overcoming that craving! 💪');
    } else {
      toast.success('Craving logged. You\'re tracking your journey!');
    }
  };

  const handleAddMeeting = () => {
    setMeetings([...meetings, {
      id: Date.now(),
      date: new Date().toISOString(),
      ...newMeeting
    }]);
    setShowAddMeeting(false);
    setNewMeeting({ type: 'AA', location: '', notes: '' });
    toast.success('Meeting logged! Keep showing up 👏');
  };

  const handleAddGrowth = () => {
    setGrowthLogs([...growthLogs, {
      id: Date.now(),
      date: new Date().toISOString(),
      ...newGrowth
    }]);
    setShowAddGrowth(false);
    setNewGrowth({ title: '', description: '' });
    toast.success('Growth logged! You\'re making progress 🌱');
  };

  const handleAddChallenge = () => {
    setChallenges([...challenges, {
      id: Date.now(),
      date: new Date().toISOString(),
      ...newChallenge
    }]);
    setShowAddChallenge(false);
    setNewChallenge({ situation: '', response: '', outcome: '' });
    toast.success('Challenge documented! Learning from experience 💪');
  };

  const handleAddGratitude = () => {
    setGratitude([...gratitude, {
      id: Date.now(),
      date: new Date().toISOString(),
      entry: newGratitudeEntry
    }]);
    setShowAddGratitude(false);
    setNewGratitudeEntry('');
    toast.success('Gratitude recorded! Staying positive ❤️');
  };

  const handleAddMeditation = () => {
    setMeditations([...meditations, {
      id: Date.now(),
      date: new Date().toISOString(),
      ...newMeditation
    }]);
    setShowAddMeditation(false);
    setNewMeditation({ duration: 10, type: 'Mindfulness', notes: '' });
    toast.success('Meditation logged! Taking care of yourself 🧘');
  };

  // Celebrate craving overcome with confetti
  const handleAddCravingWithCelebration = () => {
    handleAddCraving();
    if (celebrationsEnabled && newCraving.overcame) {
      setTimeout(() => {
        const { celebrate } = require('@/lib/celebrations');
        celebrate('cravingOvercome');
      }, 300);
    }
  };

  // Show loading skeleton while data is loading
  if (loading) {
    return <JournalScreenSkeleton />;
  }

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Journal</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cravings">Cravings</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        {/* Cravings Tab */}
        <TabsContent value="cravings" className="space-y-4">
          <Button onClick={() => setShowAddCraving(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Log Craving
          </Button>

          {cravings.slice().reverse().map(craving => (
            <Card key={craving.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">{formatDate(craving.date)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCravings(cravings.filter(c => c.id !== craving.id));
                      toast.success('Craving entry deleted');
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Intensity:</span>
                    <span className="text-sm">{craving.intensity}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Trigger:</span>
                    <span className="text-sm">{craving.trigger}</span>
                  </div>
                  {craving.triggerNotes && (
                    <p className="text-sm text-muted-foreground">{craving.triggerNotes}</p>
                  )}
                  {craving.copingStrategy && (
                    <div>
                      <span className="text-sm font-medium">Coping:</span>
                      <p className="text-sm text-muted-foreground">{craving.copingStrategy}</p>
                    </div>
                  )}
                  {craving.overcame && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Successfully overcame</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {cravings.length === 0 && (
            <EmptyState
              icon={AlertTriangle}
              title="No Cravings Logged"
              description="Track your cravings here to identify patterns and triggers. Understanding what causes cravings helps you develop better coping strategies."
              actionLabel="Log First Craving"
              onAction={() => setShowAddCraving(true)}
              iconColor="text-orange-500"
            />
          )}
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          <Button onClick={() => setShowAddMeeting(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Log Meeting
          </Button>

          {meetings.slice().reverse().map(meeting => (
            <Card key={meeting.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatDate(meeting.date)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMeetings(meetings.filter(m => m.id !== meeting.id));
                      toast.success('Meeting entry deleted');
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h4 className="font-semibold">{meeting.type}</h4>
                <p className="text-sm text-muted-foreground">{meeting.location}</p>
                {meeting.notes && (
                  <p className="text-sm mt-2">{meeting.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}

          {meetings.length === 0 && (
            <EmptyState
              icon={Users}
              title="No Meetings Logged"
              description="Keep track of your AA, NA, or support group meetings. Regular meeting attendance is a cornerstone of successful recovery."
              actionLabel="Log First Meeting"
              onAction={() => setShowAddMeeting(true)}
              iconColor="text-blue-500"
            />
          )}
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setShowAddGrowth(true)} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growth Log
            </Button>
            <Button onClick={() => setShowAddChallenge(true)} variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Challenge
            </Button>
            <Button onClick={() => setShowAddGratitude(true)} variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              Gratitude
            </Button>
            <Button onClick={() => setShowAddMeditation(true)} variant="outline">
              Meditation
            </Button>
          </div>

          {[...growthLogs, ...challenges, ...gratitude, ...meditations].length === 0 && (
            <EmptyState
              icon={TrendingUp}
              title="Start Your Growth Journey"
              description="Document your recovery milestones, daily gratitudes, challenges overcome, and meditation practice. These entries help you reflect on your progress and stay motivated."
              iconColor="text-green-500"
            />
          )}

          <div className="space-y-3">
            {[...growthLogs, ...challenges, ...gratitude, ...meditations]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 20)
              .map(entry => {
                const isGrowth = 'title' in entry && 'description' in entry && !('situation' in entry);
                const isChallenge = 'situation' in entry;
                const isGratitude = 'entry' in entry;
                const isMeditation = 'duration' in entry;

                return (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (isGrowth) {
                              setGrowthLogs(growthLogs.filter(g => g.id !== entry.id));
                              toast.success('Growth entry deleted');
                            } else if (isChallenge) {
                              setChallenges(challenges.filter(c => c.id !== entry.id));
                              toast.success('Challenge entry deleted');
                            } else if (isGratitude) {
                              setGratitude(gratitude.filter(g => g.id !== entry.id));
                              toast.success('Gratitude entry deleted');
                            } else if (isMeditation) {
                              setMeditations(meditations.filter(m => m.id !== entry.id));
                              toast.success('Meditation entry deleted');
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {isGrowth && (
                        <>
                          <h4 className="font-semibold">{(entry as any).title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{(entry as any).description}</p>
                        </>
                      )}
                      {isChallenge && (
                        <div className="space-y-1">
                          <p className="text-sm"><strong>Situation:</strong> {(entry as any).situation}</p>
                          <p className="text-sm"><strong>Response:</strong> {(entry as any).response}</p>
                          <p className="text-sm"><strong>Outcome:</strong> {(entry as any).outcome}</p>
                        </div>
                      )}
                      {isGratitude && (
                        <p className="text-sm">{(entry as any).entry}</p>
                      )}
                      {isMeditation && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{(entry as any).type}</span>
                          <span className="text-sm text-muted-foreground">{(entry as any).duration} min</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Craving Modal */}
      {showAddCraving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Log Craving</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Intensity: {newCraving.intensity}/10</label>
                <Slider
                  value={[newCraving.intensity]}
                  onValueChange={([value]) => setNewCraving({ ...newCraving, intensity: value })}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Trigger</label>
                <Select
                  value={newCraving.trigger}
                  onValueChange={(value) => setNewCraving({ ...newCraving, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_TYPES.map(trigger => (
                      <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Trigger Notes</label>
                <Textarea
                  value={newCraving.triggerNotes}
                  onChange={(e) => setNewCraving({ ...newCraving, triggerNotes: e.target.value })}
                  placeholder="What triggered this craving?"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Coping Strategy</label>
                <Textarea
                  value={newCraving.copingStrategy}
                  onChange={(e) => setNewCraving({ ...newCraving, copingStrategy: e.target.value })}
                  placeholder="How did you cope?"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overcame"
                  checked={newCraving.overcame}
                  onCheckedChange={(checked) => setNewCraving({ ...newCraving, overcame: !!checked })}
                />
                <label htmlFor="overcame" className="text-sm font-medium">
                  Successfully overcame this craving
                </label>
              </div>

              {/* HALT Assessment Toggle */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowHALTInCraving(!showHALTInCraving)}
                  className="w-full"
                >
                  {showHALTInCraving ? '✓ HALT Assessment Included' : '+ Add HALT Assessment (Recommended)'}
                </Button>
              </div>

              {/* HALT Component */}
              {showHALTInCraving && (
                <div className="border-t pt-4">
                  <HALTCheck
                    onComplete={(halt) => setCravingHaltData(halt)}
                    initialValues={cravingHaltData || undefined}
                    showSuggestions={true}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddCraving(false);
                    setShowHALTInCraving(false);
                    setCravingHaltData(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCraving} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Similar modals for other types would go here - keeping code concise */}
      {/* Add Meeting Modal */}
      {showAddMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Log Meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Meeting type (AA, NA, etc.)"
                value={newMeeting.type}
                onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              />
              <Textarea
                placeholder="Notes"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                rows={3}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddMeeting(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddMeeting} disabled={!newMeeting.type} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Growth Modal */}
      {showAddGrowth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Growth Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Title"
                value={newGrowth.title}
                onChange={(e) => setNewGrowth({ ...newGrowth, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newGrowth.description}
                onChange={(e) => setNewGrowth({ ...newGrowth, description: e.target.value })}
                rows={4}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddGrowth(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddGrowth} disabled={!newGrowth.title} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Gratitude Modal */}
      {showAddGratitude && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Gratitude Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What are you grateful for today?"
                value={newGratitudeEntry}
                onChange={(e) => setNewGratitudeEntry(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddGratitude(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddGratitude} disabled={!newGratitudeEntry} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Challenge Modal */}
      {showAddChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Log Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Situation</label>
                <Textarea
                  placeholder="What was the challenging situation?"
                  value={newChallenge.situation}
                  onChange={(e) => setNewChallenge({ ...newChallenge, situation: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Response</label>
                <Textarea
                  placeholder="How did you respond?"
                  value={newChallenge.response}
                  onChange={(e) => setNewChallenge({ ...newChallenge, response: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Outcome</label>
                <Textarea
                  placeholder="What was the outcome?"
                  value={newChallenge.outcome}
                  onChange={(e) => setNewChallenge({ ...newChallenge, outcome: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddChallenge(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddChallenge}
                  disabled={!newChallenge.situation || !newChallenge.response || !newChallenge.outcome}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Meditation Modal */}
      {showAddMeditation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Log Meditation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select
                  value={newMeditation.type}
                  onValueChange={(value) => setNewMeditation({ ...newMeditation, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDITATION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration: {newMeditation.duration} minutes</label>
                <Slider
                  value={[newMeditation.duration]}
                  onValueChange={([value]) => setNewMeditation({ ...newMeditation, duration: value })}
                  min={1}
                  max={120}
                  step={1}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <Textarea
                  placeholder="How was your practice?"
                  value={newMeditation.notes}
                  onChange={(e) => setNewMeditation({ ...newMeditation, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddMeditation(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddMeditation} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

