import express from "express";
import projectController from "../controllers/projectController";
import auth from "../middleware/authMiddleware";

const router = express.Router();

router.get("/getProject/:id", projectController.getProject);
router.post("/createProject", auth, projectController.createProject);

module.exports = router;
