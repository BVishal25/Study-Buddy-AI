import { 
  type User, 
  type InsertUser, 
  type LearningPath, 
  type InsertLearningPath,
  type Topic,
  type InsertTopic,
  type UserProgress,
  type InsertUserProgress,
  type Project,
  type InsertProject,
  type UserProject,
  type InsertUserProject,
  type ChatSession,
  type InsertChatSession,
  type ResearchPaper,
  type InsertResearchPaper
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Learning Paths
  getLearningPath(id: string): Promise<LearningPath | undefined>;
  getLearningPathsByUser(userId: string): Promise<LearningPath[]>;
  createLearningPath(learningPath: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(id: string, updates: Partial<LearningPath>): Promise<LearningPath | undefined>;
  
  // Topics
  getTopic(id: string): Promise<Topic | undefined>;
  getTopicByName(name: string): Promise<Topic | undefined>;
  getAllTopics(): Promise<Topic[]>;
  getTopicsByCategory(category: string): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // User Progress
  getUserProgress(userId: string, topicId: string): Promise<UserProgress | undefined>;
  getUserProgressByUser(userId: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // User Projects
  getUserProject(userId: string, projectId: string): Promise<UserProject | undefined>;
  getUserProjectsByUser(userId: string): Promise<UserProject[]>;
  createUserProject(userProject: InsertUserProject): Promise<UserProject>;
  updateUserProject(id: string, updates: Partial<UserProject>): Promise<UserProject | undefined>;
  
  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getChatSessionsByUser(userId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  
  // Research Papers
  getResearchPaper(id: string): Promise<ResearchPaper | undefined>;
  getTrendingPapers(limit?: number): Promise<ResearchPaper[]>;
  getResearchPapersByCategory(category: string): Promise<ResearchPaper[]>;
  createResearchPaper(paper: InsertResearchPaper): Promise<ResearchPaper>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();
  private topics: Map<string, Topic> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private projects: Map<string, Project> = new Map();
  private userProjects: Map<string, UserProject> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private researchPapers: Map<string, ResearchPaper> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create sample topics
    const topics = [
      {
        id: "ml-basics",
        name: "ml-basics",
        title: "Machine Learning Basics",
        description: "Introduction to machine learning concepts and algorithms",
        content: {
          lessons: [
            {
              id: "ml-intro",
              title: "What is Machine Learning?",
              content: "Machine learning is a subset of artificial intelligence...",
              type: "article" as const,
              estimatedTime: 30
            }
          ],
          prerequisites: [],
          learningObjectives: ["Understand ML concepts", "Identify ML types"]
        },
        difficulty: "beginner",
        estimatedTime: 120,
        category: "Machine Learning",
        tags: ["basics", "introduction"],
        connections: ["neural-networks"]
      },
      {
        id: "neural-networks",
        name: "neural-networks",
        title: "Neural Networks Fundamentals",
        description: "Learn the basic building blocks of deep learning",
        content: {
          lessons: [
            {
              id: "nn-intro",
              title: "Introduction to Neural Networks",
              content: "Neural networks are computing systems inspired by biological neural networks...",
              type: "article" as const,
              estimatedTime: 45
            }
          ],
          prerequisites: ["ml-basics"],
          learningObjectives: ["Understand neurons", "Build simple networks"]
        },
        difficulty: "intermediate",
        estimatedTime: 180,
        category: "Deep Learning",
        tags: ["neural networks", "deep learning"],
        connections: ["cnn", "rnn"]
      },
      {
        id: "cnn",
        name: "cnn",
        title: "Convolutional Neural Networks",
        description: "Image recognition and computer vision fundamentals",
        content: {
          lessons: [
            {
              id: "cnn-intro",
              title: "CNN Architecture",
              content: "Convolutional Neural Networks are specialized for processing grid-like data...",
              type: "article" as const,
              estimatedTime: 60
            }
          ],
          prerequisites: ["neural-networks"],
          learningObjectives: ["Understand convolution", "Build CNN models"]
        },
        difficulty: "intermediate",
        estimatedTime: 240,
        category: "Computer Vision",
        tags: ["cnn", "computer vision"],
        connections: ["neural-networks", "image-processing"]
      }
    ];

    topics.forEach(topic => {
      this.topics.set(topic.id, topic);
    });

    // Create sample projects
    const projects = [
      {
        id: "image-classifier",
        title: "Build an Image Classifier",
        description: "Create a CNN model to classify images using TensorFlow",
        difficulty: "intermediate",
        category: "Computer Vision",
        estimatedTime: 180,
        technologies: ["Python", "TensorFlow", "Keras"],
        instructions: {
          steps: [
            {
              id: "step1",
              title: "Set up the environment",
              description: "Install required libraries and import datasets",
              hints: ["Use pip install tensorflow", "Download CIFAR-10 dataset"]
            }
          ]
        },
        starterCode: "import tensorflow as tf\n# Your code here",
        solutionCode: "# Complete solution will be provided after submission"
      }
    ];

    projects.forEach(project => {
      this.projects.set(project.id, project);
    });

    // Create sample research papers
    const papers = [
      {
        id: "attention-is-all-you-need",
        title: "Attention Is All You Need",
        authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
        abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
        url: "https://arxiv.org/abs/1706.03762",
        publishedDate: new Date("2017-06-12"),
        category: "Natural Language Processing",
        tags: ["transformer", "attention", "nlp"],
        aiSummary: "Introduces the Transformer architecture that relies entirely on attention mechanisms, eliminating recurrence and convolutions.",
        trendingScore: 95,
        readingTime: 25
      }
    ];

    papers.forEach(paper => {
      this.researchPapers.set(paper.id, paper);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Learning Path methods
  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async getLearningPathsByUser(userId: string): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values()).filter(path => path.userId === userId);
  }

  async createLearningPath(insertLearningPath: InsertLearningPath): Promise<LearningPath> {
    const id = randomUUID();
    const learningPath: LearningPath = {
      ...insertLearningPath,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.learningPaths.set(id, learningPath);
    return learningPath;
  }

  async updateLearningPath(id: string, updates: Partial<LearningPath>): Promise<LearningPath | undefined> {
    const existing = this.learningPaths.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.learningPaths.set(id, updated);
    return updated;
  }

  // Topic methods
  async getTopic(id: string): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopicByName(name: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(topic => topic.name === name);
  }

  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopicsByCategory(category: string): Promise<Topic[]> {
    return Array.from(this.topics.values()).filter(topic => topic.category === category);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = randomUUID();
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }

  // User Progress methods
  async getUserProgress(userId: string, topicId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.topicId === topicId
    );
  }

  async getUserProgressByUser(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      ...insertProgress,
      id,
      lastAccessedAt: new Date()
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const existing = this.userProgress.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastAccessedAt: new Date() };
    this.userProgress.set(id, updated);
    return updated;
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.category === category);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // User Project methods
  async getUserProject(userId: string, projectId: string): Promise<UserProject | undefined> {
    return Array.from(this.userProjects.values()).find(
      userProject => userProject.userId === userId && userProject.projectId === projectId
    );
  }

  async getUserProjectsByUser(userId: string): Promise<UserProject[]> {
    return Array.from(this.userProjects.values()).filter(userProject => userProject.userId === userId);
  }

  async createUserProject(insertUserProject: InsertUserProject): Promise<UserProject> {
    const id = randomUUID();
    const userProject: UserProject = { ...insertUserProject, id };
    this.userProjects.set(id, userProject);
    return userProject;
  }

  async updateUserProject(id: string, updates: Partial<UserProject>): Promise<UserProject | undefined> {
    const existing = this.userProjects.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.userProjects.set(id, updated);
    return updated;
  }

  // Chat Session methods
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getChatSessionsByUser(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.userId === userId);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const existing = this.chatSessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.chatSessions.set(id, updated);
    return updated;
  }

  // Research Paper methods
  async getResearchPaper(id: string): Promise<ResearchPaper | undefined> {
    return this.researchPapers.get(id);
  }

  async getTrendingPapers(limit: number = 5): Promise<ResearchPaper[]> {
    return Array.from(this.researchPapers.values())
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  async getResearchPapersByCategory(category: string): Promise<ResearchPaper[]> {
    return Array.from(this.researchPapers.values()).filter(paper => paper.category === category);
  }

  async createResearchPaper(insertPaper: InsertResearchPaper): Promise<ResearchPaper> {
    const id = randomUUID();
    const paper: ResearchPaper = { ...insertPaper, id };
    this.researchPapers.set(id, paper);
    return paper;
  }
}

export const storage = new MemStorage();
