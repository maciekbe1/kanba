import express from "express";
import todoController from "../controllers/todoController";
import auth from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-todo-card", auth, todoController.createTodoCard);
router.post("/add-todo-item", auth, todoController.addTodoItem);
router.post("/get-user-todo-cards", auth, todoController.getUserTodo);
router.post("/remove-todo-card", auth, todoController.removeTodoCard);
router.post("/remove-todo-item", auth, todoController.removeTodoItem);
router.post("/update-todo-card", auth, todoController.updateTodoCard);

module.exports = router;
