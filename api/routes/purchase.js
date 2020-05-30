import express from "express";
import purchaseController from "../controllers/purchase";

const router = express.Router();

router.get("/",purchaseController.purchase_get_all);
router.get("/:purchaseId",purchaseController.insert_purchase);
router.post("/",purchaseController.get_purchase_by_id);
router.patch("/:purchaseId",purchaseController.update_purchase_by_id);
router.delete("/:paymentId",purchaseController.delete_purchase_by_id);

export default router;