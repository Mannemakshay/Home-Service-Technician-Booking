import express from "express";
import { addUser, getUsers, registerUser, loginUser, logoutUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/add", addUser);
router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;