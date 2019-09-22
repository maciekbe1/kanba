import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/getUser/:id", userController.getUser);
router.get("/getAllUsers", userController.getAllUsers);
router.post("/signUp", userController.signUp);

module.exports = router;
