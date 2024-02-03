import { Router } from "express";
import scheduleController from "../../controllers/schedule/schedule.controller";

const scheduleRouter: Router = Router();

scheduleRouter.route('/')
  .get(scheduleController.getSchedule);

export default scheduleRouter;
