import { Router, type IRouter } from "express";
import healthRouter from "./health";
import universitiesRouter from "./universities";
import counselorRouter from "./counselor";

const router: IRouter = Router();

router.use(healthRouter);
router.use(universitiesRouter);
router.use(counselorRouter);

export default router;
