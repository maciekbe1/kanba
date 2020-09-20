import express from "express";
import cardsController from "../controllers/cardsController";
import auth from "../middleware/authMiddleware";
import multer from "multer";

const router = express.Router();
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post("/create-card", auth, cardsController.createCard);
router.post("/create-card-item", auth, cardsController.createCardItem);
router.post("/get-user-cards", auth, cardsController.getUserCards);
router.post("/remove-card", auth, cardsController.removeCard);
router.post("/remove-card-item", auth, cardsController.removeCardItem);
router.post("/update-card-position", auth, cardsController.updateCardPosition);
router.post(
  "/update-card-properties",
  auth,
  cardsController.updateCardProperties
);
router.post(
  "/update-item-properties",
  auth,
  cardsController.updateItemProperties
);
router.post("/update-many-items", auth, cardsController.updateManyItems);
router.post("/remove-many-items", auth, cardsController.removeManyItems);
router.post(
  "/upload-file",
  [auth, multerMid.single("file")],
  cardsController.uploadFile
);
router.post("/remove-file", auth, cardsController.removeFile);

module.exports = router;
