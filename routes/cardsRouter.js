import express from "express";
import cardsController from "../controllers/cardsController";
import auth from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-card", auth, cardsController.createCard);
router.post("/create-card-item", auth, cardsController.createCardItem);
router.post("/get-user-cards", auth, cardsController.getUserCards);
router.post("/remove-card", auth, cardsController.removeCard);
router.post("/remove-card-item", auth, cardsController.removeCardItem);
router.post("/update-card", auth, cardsController.updateCard);

module.exports = router;
