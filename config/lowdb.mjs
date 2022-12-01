import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// File path
const file = path.join(__dirname, "users.json")

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read()

db.data ||= { posts: [] }; // For Node >= 15.x

const { posts } = db.data;

// Create and query items using native JS API
db.data.posts.push("hello world");
const firstPost = db.data.posts[0];

// Alternatively, you can also use this syntax if you prefer

posts.push("hello world");

// Finally write db.data content to file
await db.write();
