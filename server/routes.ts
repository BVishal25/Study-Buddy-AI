import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertLearningPathSchema, 
  insertUserProgressSchema,
  insertChatSessionSchema 
} from "@shared/schema";
import { 
  generateTutorResponse, 
  generateLearningPath, 
  assessUserKnowledge,
  summarizeResearchPaper 
} from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Topics routes
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:id", async (req, res) => {
    try {
      const topic = await storage.getTopic(req.params.id);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  });

  app.get("/api/topics/category/:category", async (req, res) => {
    try {
      const topics = await storage.getTopicsByCategory(req.params.category);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics by category" });
    }
  });

  // Learning Paths routes
  app.get("/api/learning-paths/user/:userId", async (req, res) => {
    try {
      const learningPaths = await storage.getLearningPathsByUser(req.params.userId);
      res.json(learningPaths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning paths" });
    }
  });

  app.post("/api/learning-paths", async (req, res) => {
    try {
      const pathData = insertLearningPathSchema.parse(req.body);
      const learningPath = await storage.createLearningPath(pathData);
      res.json(learningPath);
    } catch (error) {
      res.status(400).json({ error: "Invalid learning path data" });
    }
  });

  app.put("/api/learning-paths/:id", async (req, res) => {
    try {
      const updates = req.body;
      const learningPath = await storage.updateLearningPath(req.params.id, updates);
      if (!learningPath) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      res.json(learningPath);
    } catch (error) {
      res.status(500).json({ error: "Failed to update learning path" });
    }
  });

  // Generate personalized learning path
  app.post("/api/learning-paths/generate", async (req, res) => {
    try {
      const { userProfile } = req.body;
      const generatedPath = await generateLearningPath(userProfile);
      res.json(generatedPath);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate learning path" });
    }
  });

  // User Progress routes
  app.get("/api/progress/user/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgressByUser(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  app.get("/api/progress/:userId/:topicId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId, req.params.topicId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  app.put("/api/progress/:id", async (req, res) => {
    try {
      const updates = req.body;
      const progress = await storage.updateUserProgress(req.params.id, updates);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.get("/api/user-projects/:userId", async (req, res) => {
    try {
      const userProjects = await storage.getUserProjectsByUser(req.params.userId);
      res.json(userProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user projects" });
    }
  });

  // AI Tutor Chat routes
  app.get("/api/chat/sessions/:userId", async (req, res) => {
    try {
      const sessions = await storage.getChatSessionsByUser(req.params.userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat sessions" });
    }
  });

  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { sessionId, message, context } = req.body;
      
      // Get existing session
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }

      // Generate AI response
      const tutorResponse = await generateTutorResponse(message, {
        ...context,
        previousMessages: session.messages
      });

      // Add messages to session
      const newMessages = [
        ...session.messages,
        {
          id: Date.now().toString(),
          role: 'user' as const,
          content: message,
          timestamp: new Date().toISOString()
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: tutorResponse.message,
          timestamp: new Date().toISOString()
        }
      ];

      // Update session
      const updatedSession = await storage.updateChatSession(sessionId, {
        messages: newMessages,
        context
      });

      res.json({
        response: tutorResponse,
        session: updatedSession
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Assessment routes
  app.post("/api/assessment/knowledge", async (req, res) => {
    try {
      const { responses } = req.body;
      const assessment = await assessUserKnowledge(responses);
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to assess knowledge" });
    }
  });

  // Research Papers routes
  app.get("/api/research/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const papers = await storage.getTrendingPapers(limit);
      res.json(papers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending papers" });
    }
  });

  app.get("/api/research/category/:category", async (req, res) => {
    try {
      const papers = await storage.getResearchPapersByCategory(req.params.category);
      res.json(papers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch papers by category" });
    }
  });

  app.post("/api/research/summarize", async (req, res) => {
    try {
      const { title, abstract } = req.body;
      const summary = await summarizeResearchPaper(title, abstract);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to summarize paper" });
    }
  });

  // Dashboard data route
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user progress
      const progress = await storage.getUserProgressByUser(userId);
      
      // Get learning paths
      const learningPaths = await storage.getLearningPathsByUser(userId);
      
      // Get trending papers
      const trendingPapers = await storage.getTrendingPapers(3);
      
      // Get recent chat sessions
      const chatSessions = await storage.getChatSessionsByUser(userId);
      
      // Calculate stats
      const completedTopics = progress.filter(p => p.status === 'completed').length;
      const totalTopics = progress.length;
      const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
      
      res.json({
        user,
        stats: {
          completedTopics,
          totalTopics,
          overallProgress,
          learningPaths: learningPaths.length,
          recentActivity: progress.slice(0, 5)
        },
        currentLearningPath: learningPaths[0] || null,
        progress,
        trendingPapers,
        recentChatSessions: chatSessions.slice(0, 1)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
