import express from "express";
import xntEactController from '../controllers/xnt-exact';
import reportController from "../controllers/report";

const router = express.Router();
//checkAut middleware để kiểm chứng token
router.get("/100" , xntEactController.get_stockmovementsimple);
router.get("/200" , xntEactController.get_stockmovementsimple200);
router.get("/report/:month/:year", reportController.calculator_stock_movement);
export default router;
