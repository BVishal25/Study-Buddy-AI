import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProgressStats {
  completedTopics?: number;
  totalTopics?: number;
  overallProgress?: number;
  learningPaths?: number;
  recentActivity?: Array<{
    id: string;
    description: string;
    timestamp: string;
    type: 'completed' | 'started' | 'achievement';
  }>;
}

interface ProgressTrackerProps {
  stats?: ProgressStats;
}

export default function ProgressTracker({ stats }: ProgressTrackerProps) {
  const completedTopics = stats?.completedTopics || 0;
  const totalTopics = stats?.totalTopics || 0;
  const overallProgress = stats?.overallProgress || 0;
  const projectsCompleted = 12; // Mock data - would come from API
  const badgesEarned = 8; // Mock data - would come from API
  const learningStreak = 12; // Mock data - would come from API

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
              <span>{completedTopics} of {totalTopics} topics</span>
              <span>Keep going!</span>
            </div>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-graduation-cap text-secondary text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-sm">{completedTopics}</p>
                  <p className="text-xs text-muted-foreground">Lessons Completed</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                +5 this week
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-code text-purple-600 dark:text-purple-400 text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-sm">{projectsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Projects Built</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-600">
                +2 this week
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-trophy text-amber-600 dark:text-amber-400 text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-sm">{badgesEarned}</p>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                New!
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Learning Streak</span>
              <div className="flex items-center">
                <i className="fas fa-fire text-orange-500 mr-1"></i>
                <span className="font-medium">{learningStreak} days</span>
              </div>
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weekly Goal</span>
              <span className="text-xs text-muted-foreground">4/7 days</span>
            </div>
            <Progress value={57} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Study 30 minutes daily
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
