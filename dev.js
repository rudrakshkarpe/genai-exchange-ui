// Simple development server script
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  
  // Create Vite server in middleware mode (with Vite 3.x syntax)
  const vite = await createServer({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    server: {
      middlewareMode: true,
    },
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // API routes can go here
  app.use('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the API!' });
  });
  
  // Serve HTML
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, 'client/index.html'),
        'utf-8'
      );
      
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      next(e);
    }
  });
    // Start the server
  const port = 3000;
  httpServer.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`📦 Using Vite version: ${vite.version}`);
    console.log(`🔧 Node.js version: ${process.version}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
