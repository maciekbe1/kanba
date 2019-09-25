import express from "express";
import taskController from "../controllers/taskController";
import auth from "../middleware/authMiddleware";

const router = express.Router();

//find task by id
router.get("/getTask/:id", taskController.getTask);

//find all user tasks
router.get("/getAllTasks/:userID/:search*?", taskController.getAllTasks);
router.post("/createTask", auth, taskController.createTask);

module.exports = router;
