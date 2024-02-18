import Day from "../../model/Schedule";
import { Router } from "express";
import { Request, Response } from "express";

class ScheduleController {
  path: string = '/schedule';
  router: Router = Router();
   
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      .get(this.getSchedule);
  }

  public async getSchedule(req: Request, res: Response) {
    console.log('Get schedule request.');
    const daysSchedule = await Day.find(); // we get an array of days schedule
    if (!daysSchedule?.length) {
      return res.status(204).json({ 'message': 'No schedule was found.' });
    }
    return res.json(daysSchedule);
  }
}

export default new ScheduleController();