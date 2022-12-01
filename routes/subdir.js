import express from "express";
const router = express.Router();
import path from "path";

//serve static files
router.use(express.static(path.join(__dirname, "/public")));

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});

router.get("/test(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});
export default router;
