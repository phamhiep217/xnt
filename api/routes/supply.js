import express from "express";
import supplyController from "../controllers/supply";

const router = express.Router();

router.get("/", supplyController.supply_get_all);
router.get("/:supplyId", supplyController.get_Supply_by_id);
router.post("/", supplyController.insert_Supply);
router.patch("/:supplyId", supplyController.update_Supply_by_id);
router.delete("/:supplyId", supplyController.delete_Supply_by_id);
export default router;