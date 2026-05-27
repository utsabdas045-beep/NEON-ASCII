import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

// In-memory status tracking fallback
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON body parsing middleware
  app.use(express.json());

  // Live check of application configuration variables
  app.get("/api/status", (req, res) => {
    res.json({
      status: "nominal",
      offlineMode: true,
      time: new Date().toISOString()
    });
  });

  // Vite development middleware attachment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GRID HOSTING ACTIVE] Portal online at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[FATAL PORTAL EXCEPTION]", err);
});
