import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Topic {
  id: string;
  name: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  category: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
}

interface TopicCardProps {
  topic: Topic;
  onClick?: () => void;
  showProgress?: boolean;
}

export default function TopicCard({ topic, onClick, showProgress = false }: TopicCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'fas fa-check-circle text-green-500';
      case 'in_progress':
        return 'fas fa-play-circle text-primary';
      default:
        return 'fas fa-circle text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('machine learning')) return 'fas fa-cogs';
    if (categoryLower.includes('deep learning')) return 'fas fa-brain';
    if (categoryLower.includes('computer vision')) return 'fas fa-eye';
    if (categoryLower.includes('nlp') || categoryLower.includes('language')) return 'fas fa-comments';
    if (categoryLower.includes('reinforcement')) return 'fas fa-gamepad';
    return 'fas fa-layer-group';
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:bg-muted/50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {topic.status && (
              <i className={`${getStatusIcon(topic.status)} text-sm`}></i>
            )}
            <h3 className="font-medium text-sm leading-5">{topic.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getDifficultyColor(topic.difficulty)}`}
            >
              {topic.difficulty}
            </Badge>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {topic.description}
        </p>
        
        {showProgress && topic.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Progress</span>
              <span className="text-xs text-muted-foreground">{topic.progress}%</span>
            </div>
            <Progress value={topic.progress} className="h-1.5" />
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <i className="fas fa-clock mr-1"></i>
              <span>{topic.estimatedTime} min</span>
            </div>
            <div className="flex items-center">
              <i className={`${getCategoryIcon(topic.category)} mr-1`}></i>
              <span>{topic.category}</span>
            </div>
          </div>
          
          {topic.status === 'in_progress' && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Current
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
