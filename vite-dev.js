// Simple vite development script
import { createServer } from 'vite';

async function startVite() {
  try {
    const server = await createServer({
      // Use default Vite config file
      // No special configuration needed
    });
    
    await server.listen();
    
    server.printUrls();
    
    console.log('Vite server started successfully!');
    console.log(`Using Vite version: ${server.config.env.VITE_VERSION}`);
    console.log(`Node.js version: ${process.version}`);
  } catch (e) {
    console.error('Error starting Vite server:', e);
    process.exit(1);
  }
}

startVite();
