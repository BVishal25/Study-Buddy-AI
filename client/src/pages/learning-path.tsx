import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const DEMO_USER_ID = "demo-user-123";

export default function LearningPath() {
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['/api/topics'],
  });

  const { data: progress } = useQuery({
    queryKey: ['/api/progress/user', DEMO_USER_ID],
  });

  if (topicsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string) => {
    const topicProgress = progress?.find((p: any) => p.topicId === topicId);
    return topicProgress?.progressPercentage || 0;
  };

  const getTopicStatus = (topicId: string) => {
    const topicProgress = progress?.find((p: any) => p.topicId === topicId);
    return topicProgress?.status || 'not_started';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Learning Path
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Follow your personalized journey through AI and machine learning concepts
            </p>
          </div>

          {/* Learning Path Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course Completion</span>
                  <span className="text-sm text-muted-foreground">3 of 8 topics completed</span>
                </div>
                <Progress value={37.5} className="w-full" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Beginner</span>
                  <span>37.5% Complete</span>
                  <span>Advanced</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topics List */}
          <div className="grid gap-6">
            {topics?.map((topic: any, index: number) => {
              const topicProgress = getTopicProgress(topic.id);
              const status = getTopicStatus(topic.id);
              
              return (
                <Card key={topic.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Topic Number */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                          ${status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : status === 'in_progress' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }
                        `}>
                          {status === 'completed' ? (
                            <i className="fas fa-check"></i>
                          ) : (
                            index + 1
                          )}
                        </div>

                        {/* Topic Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{topic.title}</h3>
                            <Badge variant={
                              topic.difficulty === 'beginner' ? 'secondary' :
                              topic.difficulty === 'intermediate' ? 'default' : 'destructive'
                            }>
                              {topic.difficulty}
                            </Badge>
                            {status === 'in_progress' && (
                              <Badge className="bg-primary text-primary-foreground">
                                Current
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{topic.description}</p>
                          
                          <div className="flex items-center space-x-6 mb-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <i className="fas fa-clock mr-2"></i>
                              <span>{topic.estimatedTime} minutes</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <i className="fas fa-tag mr-2"></i>
                              <span>{topic.category}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <i className="fas fa-book mr-2"></i>
                              <span>{topic.content?.lessons?.length || 0} lessons</span>
                            </div>
                          </div>

                          {/* Progress Bar for in-progress topics */}
                          {status === 'in_progress' && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm text-muted-foreground">{topicProgress}%</span>
                              </div>
                              <Progress value={topicProgress} className="w-full" />
                            </div>
                          )}

                          {/* Prerequisites */}
                          {topic.content?.prerequisites?.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Prerequisites:</h4>
                              <div className="flex flex-wrap gap-2">
                                {topic.content.prerequisites.map((prereq: string) => (
                                  <Badge key={prereq} variant="outline" className="text-xs">
                                    {prereq}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Learning Objectives */}
                          {topic.content?.learningObjectives?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">You'll learn:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {topic.content.learningObjectives.map((objective: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-1 text-xs"></i>
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="ml-6">
                        <Button 
                          variant={status === 'completed' ? 'outline' : 'default'}
                          disabled={status === 'not_started' && index > 0 && getTopicStatus(topics[index - 1]?.id) !== 'completed'}
                        >
                          {status === 'completed' ? (
                            <>
                              <i className="fas fa-redo mr-2"></i>
                              Review
                            </>
                          ) : status === 'in_progress' ? (
                            <>
                              <i className="fas fa-play mr-2"></i>
                              Continue
                            </>
                          ) : (
                            <>
                              <i className="fas fa-play mr-2"></i>
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
