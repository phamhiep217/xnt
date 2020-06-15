import express from "express";
import partshipController from "../controllers/partship";

const router = express.Router();

router.get("/", partshipController.partship_get_all);
router.get("/:partshipId", partshipController.get_partship_by_id);
router.post("/", partshipController.insert_partship);
router.patch("/:partshipId", partshipController.update_payment_by_id);
router.delete("/:partshipId", partshipController.delete_partship_by_id);
export default router;