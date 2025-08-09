import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publishedDate: string;
  category: string;
  tags: string[];
  aiSummary?: string;
  trendingScore: number;
  readingTime: number;
}

export default function TrendingPapers() {
  const { data: papers, isLoading } = useQuery({
    queryKey: ['/api/research/trending'],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('nlp') || categoryLower.includes('language')) {
      return 'border-l-blue-500';
    }
    if (categoryLower.includes('vision') || categoryLower.includes('image')) {
      return 'border-l-green-500';
    }
    if (categoryLower.includes('reinforcement')) {
      return 'border-l-purple-500';
    }
    if (categoryLower.includes('generative')) {
      return 'border-l-pink-500';
    }
    return 'border-l-primary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trending Papers</CardTitle>
          <Button variant="link" className="text-primary p-0 h-auto text-sm">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-64 custom-scrollbar">
            <div className="space-y-4">
              {papers?.map((paper: ResearchPaper) => (
                <div 
                  key={paper.id} 
                  className={`border-l-4 pl-4 py-2 hover:bg-muted/50 rounded-r transition-colors cursor-pointer ${getCategoryColor(paper.category)}`}
                >
                  <h4 className="font-medium text-sm leading-5 mb-1 line-clamp-2">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {paper.authors.slice(0, 2).join(', ')}
                    {paper.authors.length > 2 && ` +${paper.authors.length - 2} more`}
                  </p>
                  
                  {paper.aiSummary && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {paper.aiSummary}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(paper.publishedDate)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {paper.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      >
                        {paper.readingTime} min read
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <i className="fas fa-fire mr-1 text-orange-500"></i>
                        <span>{paper.trendingScore}</span>
                      </div>
                    </div>
                  </div>
                  
                  {paper.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {paper.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs px-1 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {(!papers || papers.length === 0) && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  <i className="fas fa-newspaper text-2xl mb-2"></i>
                  <p className="text-sm">No trending papers available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        <div className="mt-4 pt-3 border-t border-border">
          <Button variant="outline" className="w-full text-sm">
            <i className="fas fa-rss mr-2"></i>
            Subscribe to Updates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
