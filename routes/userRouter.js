import express from "express";
import userController from "../controllers/userController";
import auth from "../middleware/authMiddleware";
const router = express.Router();

// router.get("/getUser/:id", userController.getUser);
router.get("/me", auth, userController.me);

router.get("/getAllUsers", userController.getAllUsers);
router.post("/signUp", userController.signUp);

module.exports = router;
