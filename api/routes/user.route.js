import express from "express";
import { deleteUser, test, updateUser, getUserListing } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get("/listing/:id", verifyToken, getUserListing)

export default router;