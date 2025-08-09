import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import KnowledgeGraph from "@/components/knowledge-graph/knowledge-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const DEMO_USER_ID = "demo-user-123";

export default function KnowledgeGraphPage() {
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['/api/topics'],
  });

  const { data: progress } = useQuery({
    queryKey: ['/api/progress/user', DEMO_USER_ID],
  });

  const selectedTopicRef = useRef<any>(null);

  if (topicsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <Skeleton className="h-96 w-full" />
          </main>
        </div>
      </div>
    );
  }

  const getTopicStatus = (topicId: string) => {
    const topicProgress = progress?.find((p: any) => p.topicId === topicId);
    return topicProgress?.status || 'not_started';
  };

  const getTopicProgress = (topicId: string) => {
    const topicProgress = progress?.find((p: any) => p.topicId === topicId);
    return topicProgress?.progressPercentage || 0;
  };

  const graphData = topics ? {
    nodes: topics.map((topic: any) => ({
      id: topic.id,
      name: topic.name,
      title: topic.title,
      description: topic.description,
      status: getTopicStatus(topic.id),
      progress: getTopicProgress(topic.id),
      category: topic.category,
      difficulty: topic.difficulty,
      estimatedTime: topic.estimatedTime
    })),
    links: topics.flatMap((topic: any) => 
      (topic.connections || []).map((connectionId: string) => ({
        source: topic.id,
        target: connectionId
      }))
    ).filter((link: any) => 
      topics.some((t: any) => t.id === link.target)
    )
  } : { nodes: [], links: [] };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Knowledge Graph
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore the interconnected world of AI concepts and track your learning progress
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Knowledge Graph Visualization */}
            <div className="xl:col-span-3">
              <Card className="h-[600px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Interactive Knowledge Map</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <i className="fas fa-expand mr-2"></i>
                        Fullscreen
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="fas fa-filter mr-2"></i>
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <KnowledgeGraph 
                    data={graphData}
                    onNodeSelect={(node) => {
                      selectedTopicRef.current = node;
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              
              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <span className="text-sm">Not Started</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-1 bg-gray-400 rounded"></div>
                      <span className="text-sm">Prerequisites</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-1 bg-gray-300 rounded border-2 border-dashed border-gray-400"></div>
                      <span className="text-sm">Future Topics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Topic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topic Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <i className="fas fa-mouse-pointer text-3xl mb-4"></i>
                    <p className="text-sm">Click on a topic in the graph to see detailed information</p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Topics</span>
                      <Badge variant="outline">{topics?.length || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <Badge className="bg-green-500 text-white">
                        {progress?.filter((p: any) => p.status === 'completed').length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">In Progress</span>
                      <Badge className="bg-primary text-primary-foreground">
                        {progress?.filter((p: any) => p.status === 'in_progress').length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">
                        {Math.round(((progress?.filter((p: any) => p.status === 'completed').length || 0) / (topics?.length || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <i className="fas fa-route mr-2"></i>
                      View Learning Path
                    </Button>
                    <Button className="w-full" variant="outline">
                      <i className="fas fa-search mr-2"></i>
                      Find Topics
                    </Button>
                    <Button className="w-full" variant="outline">
                      <i className="fas fa-download mr-2"></i>
                      Export Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
