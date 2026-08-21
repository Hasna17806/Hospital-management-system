import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDepartments,
} from "../controllers/doctors.controller";

const router = Router();

router.get("/", getDoctors);
router.get("/departments/all", getDepartments); // used by the "Add Doctor" form dropdown
router.get("/:id", getDoctorById);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
