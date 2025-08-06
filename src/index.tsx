import { serve } from "bun";
import index from "./index.html";
import { close, fetch, message, open, pong } from './utils/signaling';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  fetch,

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },

  websocket: {
    message,
    open,
    pong,
    close
  }
});

console.log(`🚀 Server running at ${server.url}`);
