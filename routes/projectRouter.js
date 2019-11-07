import express from "express";
import projectController from "../controllers/projectController";
import auth from "../middleware/authMiddleware";
import isAdmin from "../middleware/projectAdmin";

const router = express.Router();

router.get("/getProject/:id", auth, projectController.getProject);
router.post("/createProject", auth, projectController.createProject);
router.delete(
    "/deleteProject/:id",
    [auth, isAdmin],
    projectController.deleteProject
);

module.exports = router;
