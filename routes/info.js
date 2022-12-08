import express from "express";
const router = express.Router();

import { getInfo, updateInfo } from "../controllers/infoController.js";

router.route("/:id").get(getInfo).put(updateInfo);
export default router;
