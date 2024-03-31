import { Router, Response } from "express";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import ScheduleService, { getScheduleResult } from "../../service/schedule.service";
import { ActivityDtoBuilder } from "../../dto/activity.dto";
import { InsertResult } from "typeorm";

export class ScheduleController {
  path: string = '/schedule';
  router: Router = Router();
  public scheduleService: ScheduleService = new ScheduleService();
  private activityDtoBuilder: ActivityDtoBuilder = new ActivityDtoBuilder();
   
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getSchedule)
      // @ts-ignore
      .post(this.addActivity)
      // @ts-ignore
      .put(this.updateActivity)
      // @ts-ignore
      .delete(this.deleteActivity)
  }

  // URL: http://localhost:3500/schedule?week_day:=day
  public getSchedule = async (req: RequestWithUserId, res: Response) => {
    console.log('Get schedule request.');
    const weekDay: string = req.query.week_day as string;
    try {
      console.log(weekDay);
      const result = await this.scheduleService.getAllActivities(req.id, weekDay);
      // const result = await this.scheduleService.getAllActivities(req.id);
      return res.json({ result });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  public addActivity = async (req: RequestWithUserId, res: Response) => {
    console.log('Add activity request');
    const { name, dayName, time, url } = req.body;
    if (!name || !dayName || !time) {
      return res.status(400).json({ message: 'Activity name, day name and time are required.' });
    }
    try {
      const result: string = await this.scheduleService.addActivity(this.activityDtoBuilder.addName(name).addTime(time).addDayName(dayName).addUrl(url ? url : '').addUserId(req.id).build());
      return res.status(201).json({ message: result });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  // URL: http://localhost:3500/schedule?activity_id:=id
  public updateActivity = async (req: RequestWithUserId, res: Response) => {
    console.log('Update activity request');
    const activityId: number = parseInt(req.query.activity_id as string) || 0;
    const { name, dayName, time, url } = req.body;
    if (!activityId) {
      return res.status(400).json({ message: 'Activity ID is required.' });
    } else if (!name && !dayName && !time && !url) {
      return res.sendStatus(204);
    }
    try {
      const result = await this.scheduleService.updateActivity(this.activityDtoBuilder.addId(activityId).addName(name).addDayName(dayName).addTime(time).addUrl(url ? url : '').addUserId(req.id).build());
      console.log('Result of updating todo:', result);
      return res.sendStatus(200);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  // URL: http://localhost:3500/schedule?activity_id:=id
  public deleteActivity = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete activity request');
    const activityId: number = parseInt(req.query.activity_id as string) || 0;
    if (!activityId) {
      return res.status(400).json({ message: 'Activity ID is required.' });
    }
    try {
      const result = await this.scheduleService.deleteActivity(this.activityDtoBuilder.addId(activityId).addUserId(req.id).build());
      console.log('Delete activity result:', result.message);
      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }
}

export default new ScheduleController();