import express from "express";
import Task from "../models/Task";
import taskController from "../controllers/taskController";

const router = express.Router();

//find task by id
router.get("/getTask/:id", taskController.getTask);

//find all user tasks
router.get("/getAllTasks/:userID/:search*?", taskController.getAllTasks);

module.exports = router;
