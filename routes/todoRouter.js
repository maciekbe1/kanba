import express from "express";
import todoController from "../controllers/todoController";
import auth from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-todo-list", auth, todoController.createTodoList);
router.post("/add-todo-item", auth, todoController.addTodoItem);
router.post("/get-user-todo-lists", auth, todoController.getUserTodoLists);
router.post("/remove-todo-list", auth, todoController.removeTodoList);

module.exports = router;
