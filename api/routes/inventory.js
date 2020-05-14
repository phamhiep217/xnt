import express from "express";
import xntEactController from '../controllers/xnt-exact';

const router = express.Router();
//checkAut middleware để kiểm chứng token
router.get("/" , xntEactController.get_stockmovementsimple);

export default router;
