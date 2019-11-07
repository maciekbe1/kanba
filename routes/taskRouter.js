import express from "express";
import taskController from "../controllers/taskController";
import auth from "../middleware/authMiddleware";
import isAdmin from "../middleware/taskAdmin";
const router = express.Router();

//find task by id
router.get("/getTask/:id", auth, taskController.getTask);

//find all user tasks
router.get("/getAllTasks/:userID/:search*?", auth, taskController.getAllTasks);
router.post("/createTask", auth, taskController.createTask);
router.delete("/deleteTask/:id", [auth, isAdmin], taskController.deleteTask);

module.exports = router;
