import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ProgressTracker from "@/components/learning/progress-tracker";
import TopicCard from "@/components/learning/topic-card";
import AITutorChat from "@/components/ai-tutor/ai-tutor-chat";
import TrendingPapers from "@/components/research/trending-papers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

const DEMO_USER_ID = "demo-user-123";

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard', DEMO_USER_ID],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: topics } = useQuery({
    queryKey: ['/api/topics'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="space-y-8">
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const currentTopic = topics?.find((topic: any) => topic.name === 'neural-networks');
  const nextTopics = topics?.filter((topic: any) => 
    ['cnn', 'nlp', 'reinforcement-learning'].includes(topic.name)
  ).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {dashboardData?.user?.firstName || 'Learner'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Continue your AI learning journey. You're making great progress!
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => navigate('/learning-path')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <i className="fas fa-play mr-2"></i>
                  Continue Learning
                </Button>
              </div>
            </div>
          </div>

          {/* Learning Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Current Learning Path */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Learning Path</CardTitle>
                    <span className="text-sm text-muted-foreground">Updated 2 hours ago</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Current Topic */}
                  {currentTopic && (
                    <div className="bg-gradient-to-r from-primary/10 to-purple-50 dark:from-primary/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Badge className="bg-primary text-primary-foreground">Current</Badge>
                            <span className="ml-2 text-sm text-muted-foreground">Chapter 3 of 8</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{currentTopic.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{currentTopic.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <i className="fas fa-clock mr-1"></i>
                                <span>{currentTopic.estimatedTime} min</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <i className="fas fa-signal mr-1"></i>
                                <span>{currentTopic.difficulty}</span>
                              </div>
                            </div>
                            <Button 
                              onClick={() => navigate('/learning-path')}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Continue
                            </Button>
                          </div>
                        </div>
                        <div className="ml-6">
                          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-brain text-primary text-xl"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Topics Preview */}
                  <div>
                    <h4 className="font-medium mb-4">Up Next</h4>
                    <div className="space-y-3">
                      {nextTopics.map((topic: any) => (
                        <TopicCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              
              {/* AI Tutor Widget */}
              <AITutorChat />

              {/* Quick Stats */}
              <ProgressTracker 
                stats={dashboardData?.stats}
              />

              {/* Trending Papers */}
              <TrendingPapers />

            </div>
          </div>

          {/* Knowledge Graph Preview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Knowledge Graph</CardTitle>
                  <p className="text-muted-foreground text-sm">Visualize your learning progress and topic connections</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/knowledge-graph')}
                  >
                    <i className="fas fa-expand mr-2"></i>
                    Full Screen
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-project-diagram text-4xl text-muted-foreground mb-4"></i>
                  <p className="text-muted-foreground">Interactive knowledge graph visualization</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/knowledge-graph')}
                  >
                    View Knowledge Graph
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-6 h-auto"
                    onClick={() => navigate('/sandbox')}
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                      <i className="fas fa-code text-primary text-lg"></i>
                    </div>
                    <span className="font-medium text-sm">Open Sandbox</span>
                    <span className="text-xs text-muted-foreground mt-1">Code & experiment</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-6 h-auto"
                  >
                    <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-3">
                      <i className="fas fa-tasks text-secondary text-lg"></i>
                    </div>
                    <span className="font-medium text-sm">Start Project</span>
                    <span className="text-xs text-muted-foreground mt-1">Build something real</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-6 h-auto"
                  >
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
                      <i className="fas fa-users text-purple-500 text-lg"></i>
                    </div>
                    <span className="font-medium text-sm">Join Discussion</span>
                    <span className="text-xs text-muted-foreground mt-1">Connect with peers</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-6 h-auto"
                  >
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3">
                      <i className="fas fa-trophy text-amber-500 text-lg"></i>
                    </div>
                    <span className="font-medium text-sm">Take Challenge</span>
                    <span className="text-xs text-muted-foreground mt-1">Test your skills</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-secondary text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Completed "Introduction to Neural Networks"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-code text-primary text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Submitted project "Image Classifier"</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-trophy text-amber-500 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Earned "Deep Learning Pioneer" badge</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="link" className="text-primary p-0">
                      View all activity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </div>

        </main>
      </div>
    </div>
  );
}
