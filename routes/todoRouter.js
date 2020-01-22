import express from "express";
import todoController from "../controllers/todoController";
import auth from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-card", auth, todoController.createCard);
router.post("/create-card-item", auth, todoController.createCardItem);
router.post("/get-user-cards", auth, todoController.getUserCards);
router.post("/remove-card", auth, todoController.removeCard);
router.post("/remove-card-item", auth, todoController.removeCardItem);
router.post("/update-card", auth, todoController.updateCard);

module.exports = router;
