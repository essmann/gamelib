// ...existing code...
import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string,
      email: string,
      games_last_modified: Date,
      
    };
  }
}
// ...existing code...