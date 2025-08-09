import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
// --- auto-seed curated content if present ---
import fs from 'fs';
import path from 'path';
import { storage } from './storage';

(async function maybeSeedCurated(){ 
  try {
    const topicsCount = (await storage.getAllTopics()).length;
    const seedPath = path.join(__dirname, '..', 'content', 'curated_topics.json');
    if (topicsCount < 8 && fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.topics)) {
        for (const t of parsed.topics) {
          // avoid duplicates by id or name
          const existing = await storage.getTopicByName(t.name).catch(()=>undefined);
          if (!existing) {
            await storage.createTopic({
              name: t.name,
              title: t.title,
              description: t.description,
              content: t.content,
              difficulty: t.difficulty || 'beginner',
              estimatedTime: t.estimatedTime || 30,
              category: t.category || 'General',
              tags: t.tags || [],
              connections: t.connections || [],
              aiSummary: t.aiSummary || null
            });
          }
        }
        console.log('Curated topics seeded from curated_topics.json');
      }
    }
  } catch (err) {
    console.error('Failed to seed curated topics', err);
  }
})();
// --- end auto-seed curated content ---\n
// --- auto-seed curated projects ---
import path from 'path';
(async function maybeSeedProjects(){
  try {
    const projs = await storage.getAllProjects();
    const seedPath = path.join(__dirname, '..', 'content', 'curated_projects.json');
    if ((projs||[]).length < 3 && fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath,'utf-8');
      const parsed = JSON.parse(raw);
      for (const p of parsed.projects || []) {
        const existing = await storage.getProject(p.id).catch(()=>undefined);
        if (!existing) {
          await storage.createProject({
            id: p.id,
            title: p.title,
            description: p.description,
            repoTemplateUrl: p.templateRepo,
            testSuite: p.tests || [],
            difficulty: p.difficulty || 'beginner'
          });
        }
      }
      console.log('Curated projects seeded');
    }
  } catch(e) {
    console.error('Failed to seed projects', e);
  }
})();
// --- end auto-seed curated projects ---


import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
