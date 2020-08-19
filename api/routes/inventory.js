import express from "express";
import xntExactController from '../controllers/xnt-exact';
import xntExactKTController from '../controllers/xnt-exact-kt';
import reportController from "../controllers/report";

const router = express.Router();
//checkAut middleware để kiểm chứng token
router.get("/100" , xntExactController.get_stockmovementsimple);
router.get("/200" , xntExactController.get_stockmovementsimple200);
router.get("/report/:month/:year", reportController.calculator_stock_movement);
router.post("/calcinv", xntExactKTController.get_stockmovementsimple_kt);
router.post("/calcinv200",xntExactKTController.get_stockmovementsimple200_kt);
router.post("/getinv",xntExactKTController.show_stockmovementsimple_kt);
router.post("/BCTK", xntExactKTController.exportBCTK);
router.post("/BCTONTHEOKHO", xntExactKTController.exportBCTonTheoKho);
router.post("/BCXNTNVL100", xntExactKTController.get_stockNVL100);
router.post("/BCXNTNVL200", xntExactKTController.get_stockNVL200);
router.post("/BCXNTTP100", xntExactKTController.get_stockTP100);
router.post("/BCXNTTP200", xntExactKTController.get_stockTP200);
export default router;
