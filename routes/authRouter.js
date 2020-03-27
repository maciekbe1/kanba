import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/", authController.signIn);
router.post("/googleSignIn", authController.googleSignIn);

module.exports = router;
