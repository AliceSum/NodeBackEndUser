import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));

import cors from "cors";

import corsOptions from "./config/corsOptions.js";
import logger from "./middleware/logEvents.js";

import errorHandler from "./middleware/errorHandler.js";
import verifyJWT from "./middleware/verifyJWT.js";

import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";

//routes files
import root from "./routes/root.js";
import register from "./routes/register.js";
import auth from "./routes/auth.js";
import refresh from "./routes/refresh.js";
import logout from "./routes/logout.js";
import info from "./routes/info.js";

const PORT = process.env.PORT || 3500;

app.use(logger);

//Use the credentials before the cors
//It is what the node.js requires.
app.use(credentials);

app.use(cors(corsOptions));

// middleware to for unlencoded from data
app.use(express.urlencoded({ extended: false }));
// middleware for json
app.use(express.json());

//middeleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/", root);
app.use("/register", register);
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/logout", logout);

//This works like a waterfall, so the routes below will require verifyJWT middleware
app.use(verifyJWT);
app.use("/info", info); //get use info at profile page

// Route handlers

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
