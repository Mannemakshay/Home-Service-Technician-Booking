import express from "express";
import { addTechnician, getTechnicians, deleteTechnician } from "../controllers/technicianController.js";

const router = express.Router();

router.post("/add", addTechnician);
router.get("/", getTechnicians);
router.delete("/:id", deleteTechnician);

export default router;