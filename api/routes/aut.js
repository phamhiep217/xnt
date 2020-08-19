import express from "express";
import checkAut from "../middleware/check-aut";
import autController from '../controllers/aut';

const router = express.Router();
//checkAut middleware để kiểm chứng token
router.get("/", autController.aut_get_all);

router.get("/:empId",checkAut, autController.aut_get_by_id);

router.patch("/:empId",autController.update_emp_by_id);

router.post("/login", autController.aut_login);

router.post("/signup", autController.aut_signup);

router.delete("/:userId", checkAut, autController.aut_del_emp_by_id);
export default router;
