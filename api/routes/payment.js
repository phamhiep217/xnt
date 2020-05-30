import express from "express";
import paymentController from "../controllers/payment";

const router = express.Router();

router.get("/", paymentController.payment_get_all);
router.get("/:paymentId", paymentController.get_payment_by_id);
router.post("/", paymentController.insert_payment);
router.patch("/:paymentId", paymentController.update_payment_by_id);
router.delete("/:paymentId", paymentController.delete_payment_by_id);
export default router;