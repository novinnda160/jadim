import express from "express";
import { getUserTrips } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id/trips", getUserTrips);

export default router;
