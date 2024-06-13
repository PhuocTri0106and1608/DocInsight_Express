import { Router } from "express";
import {
  request_change_password,
  change_password,
  get_user_by_id,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/request-change-password/:_id", request_change_password);
router.post("/change-password/:_id", change_password);
router.get("/user/:_id", get_user_by_id);
router.delete("/user/:id", deleteUser);


export default router;
