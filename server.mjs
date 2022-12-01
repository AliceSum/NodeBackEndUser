import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb";

const app = express();
app.use(express.json());

const adapter = new JSONFile("db.json");
const db = new Low(adapter);
await db.read();
db.data ||= { posts: [] };

const { posts } = db.data;

app.get("/posts/:id", async (req, res) => {
  console.log(req.params);
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  res.status(200).json(post);
});

app.post("/posts", async (req, res, next) => {
  const post = posts.push(req.body);
  await db.write();
  res.status(201).json(post);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
