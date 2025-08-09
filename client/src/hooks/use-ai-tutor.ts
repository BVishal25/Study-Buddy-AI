import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  context?: {
    currentTopic?: string;
    learningPath?: string;
    difficulty?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TutorResponse {
  message: string;
  suggestions?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'exercise';
  }>;
}

export function useAITutor(userId: string) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get existing chat sessions
  const { data: sessions } = useQuery({
    queryKey: ['/api/chat/sessions', userId],
    enabled: !!userId,
  });

  // Get current session messages
  const currentSession = sessions?.find((s: ChatSession) => s.id === currentSessionId) || null;
  const messages = currentSession?.messages || [];

  // Create new chat session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/chat/sessions', {
        userId,
        messages: [],
        context: {}
      });
      return response.json();
    },
    onSuccess: (newSession: ChatSession) => {
      setCurrentSessionId(newSession.id);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions', userId] });
    },
  });

  // Send message to AI tutor
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      sessionId, 
      message, 
      context 
    }: { 
      sessionId: string; 
      message: string; 
      context?: any;
    }) => {
      const response = await apiRequest('POST', '/api/chat/message', {
        sessionId,
        message,
        context
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions', userId] });
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  // Initialize session if user has existing sessions
  useEffect(() => {
    if (sessions && sessions.length > 0 && !currentSessionId) {
      // Use the most recent session
      const mostRecent = sessions.reduce((latest: ChatSession, current: ChatSession) => {
        return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
      });
      setCurrentSessionId(mostRecent.id);
    }
  }, [sessions, currentSessionId]);

  const createSession = async (): Promise<string | null> => {
    try {
      const newSession = await createSessionMutation.mutateAsync();
      return newSession.id;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  };

  const sendMessage = async (
    sessionId: string, 
    message: string, 
    context?: any
  ): Promise<TutorResponse | null> => {
    try {
      const result = await sendMessageMutation.mutateAsync({
        sessionId,
        message,
        context
      });
      return result.response;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  };

  const startNewConversation = async () => {
    const sessionId = await createSession();
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
    return sessionId;
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  return {
    messages,
    currentSession,
    currentSessionId,
    sessions: sessions || [],
    isLoading: sendMessageMutation.isPending || createSessionMutation.isPending,
    createSession,
    sendMessage,
    startNewConversation,
    switchToSession,
    error: sendMessageMutation.error || createSessionMutation.error,
  };
}
