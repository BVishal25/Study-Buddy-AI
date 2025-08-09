import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  completedLessons: string[];
  timeSpent: number;
  lastAccessedAt: string;
  completedAt?: string;
}

interface ProgressStats {
  completedTopics: number;
  totalTopics: number;
  overallProgress: number;
  timeSpent: number;
  streak: number;
  weeklyGoalProgress: number;
  recentAchievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: string;
    type: 'completion' | 'streak' | 'project' | 'milestone';
  }>;
}

export function useProgress(userId: string) {
  const queryClient = useQueryClient();

  // Get user's progress for all topics
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/progress/user', userId],
    enabled: !!userId,
  });

  // Get specific topic progress
  const getTopicProgress = (topicId: string) => {
    return useQuery({
      queryKey: ['/api/progress', userId, topicId],
      enabled: !!(userId && topicId),
    });
  };

  // Update progress for a topic
  const updateProgressMutation = useMutation({
    mutationFn: async ({ 
      progressId, 
      updates 
    }: { 
      progressId: string; 
      updates: Partial<UserProgress>;
    }) => {
      const response = await apiRequest('PUT', `/api/progress/${progressId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress/user', userId] });
    },
  });

  // Create new progress record
  const createProgressMutation = useMutation({
    mutationFn: async (progressData: {
      userId: string;
      topicId: string;
      status: string;
      progressPercentage?: number;
    }) => {
      const response = await apiRequest('POST', '/api/progress', progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress/user', userId] });
    },
  });

  // Calculate progress statistics
  const calculateStats = (): ProgressStats => {
    if (!progressData) {
      return {
        completedTopics: 0,
        totalTopics: 0,
        overallProgress: 0,
        timeSpent: 0,
        streak: 0,
        weeklyGoalProgress: 0,
        recentAchievements: []
      };
    }

    const completedTopics = progressData.filter((p: UserProgress) => p.status === 'completed').length;
    const totalTopics = progressData.length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const totalTimeSpent = progressData.reduce((sum: number, p: UserProgress) => sum + p.timeSpent, 0);

    // Calculate streak (simplified - would be more complex in real implementation)
    const recentActivity = progressData
      .filter((p: UserProgress) => p.lastAccessedAt)
      .sort((a: UserProgress, b: UserProgress) => 
        new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      );

    let streak = 0;
    const today = new Date();
    for (const activity of recentActivity) {
      const activityDate = new Date(activity.lastAccessedAt);
      const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    // Mock weekly goal progress (would be calculated based on actual weekly activity)
    const weeklyGoalProgress = Math.min(100, (streak / 7) * 100);

    // Mock recent achievements
    const recentAchievements = [
      {
        id: '1',
        title: 'Neural Network Master',
        description: 'Completed Neural Networks fundamentals',
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'completion' as const
      },
      {
        id: '2',
        title: 'Consistent Learner',
        description: '7-day learning streak achieved',
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'streak' as const
      }
    ];

    return {
      completedTopics,
      totalTopics,
      overallProgress,
      timeSpent: totalTimeSpent,
      streak,
      weeklyGoalProgress,
      recentAchievements
    };
  };

  const updateTopicProgress = async (
    topicId: string, 
    progressPercentage: number,
    status?: 'not_started' | 'in_progress' | 'completed'
  ) => {
    const existingProgress = progressData?.find((p: UserProgress) => p.topicId === topicId);
    
    if (existingProgress) {
      return updateProgressMutation.mutateAsync({
        progressId: existingProgress.id,
        updates: {
          progressPercentage,
          status: status || (progressPercentage >= 100 ? 'completed' : 'in_progress'),
          ...(progressPercentage >= 100 && { completedAt: new Date().toISOString() })
        }
      });
    } else {
      return createProgressMutation.mutateAsync({
        userId,
        topicId,
        status: status || (progressPercentage >= 100 ? 'completed' : 'in_progress'),
        progressPercentage
      });
    }
  };

  const markTopicCompleted = async (topicId: string) => {
    return updateTopicProgress(topicId, 100, 'completed');
  };

  const startTopic = async (topicId: string) => {
    return updateTopicProgress(topicId, 0, 'in_progress');
  };

  const addLessonCompletion = async (topicId: string, lessonId: string) => {
    const existingProgress = progressData?.find((p: UserProgress) => p.topicId === topicId);
    
    if (existingProgress) {
      const updatedLessons = [...(existingProgress.completedLessons || [])];
      if (!updatedLessons.includes(lessonId)) {
        updatedLessons.push(lessonId);
      }

      // Calculate new progress percentage (simplified)
      const totalLessons = 10; // This would come from topic data
      const progressPercentage = Math.round((updatedLessons.length / totalLessons) * 100);

      return updateProgressMutation.mutateAsync({
        progressId: existingProgress.id,
        updates: {
          completedLessons: updatedLessons,
          progressPercentage,
          status: progressPercentage >= 100 ? 'completed' : 'in_progress',
          timeSpent: existingProgress.timeSpent + 30, // Add 30 minutes
          ...(progressPercentage >= 100 && { completedAt: new Date().toISOString() })
        }
      });
    }
  };

  return {
    progressData: progressData || [],
    isLoading: progressLoading,
    stats: calculateStats(),
    getTopicProgress,
    updateTopicProgress,
    markTopicCompleted,
    startTopic,
    addLessonCompletion,
    isUpdating: updateProgressMutation.isPending || createProgressMutation.isPending,
    error: updateProgressMutation.error || createProgressMutation.error,
  };
}
