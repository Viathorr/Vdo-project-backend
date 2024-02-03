// GET (all days)
import Day from "../../model/Schedule";
import { Request, Response } from "express";

class ScheduleController {
  async getSchedule(req: Request, res: Response) {
    const daysSchedule = await Day.find(); // we get an array of days schedule
    if (!daysSchedule?.length) {
      return res.status(204).json({ 'message': 'No schedule was found.' });
    }
    return res.json(daysSchedule);
  }
}

export default new ScheduleController();