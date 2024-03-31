import { ActivityDto } from "../dto/activity.dto";
import AppDataSource from "../config/mysqlConn";
import { Activity } from "../entity/activity.entity";
import { DeleteResult, Repository } from "typeorm";

type getActivityResult = {
  id: number,
  name: string,
  weekDay?: string,
  url: string,
  time: string
}

export type getScheduleResult = {
  Monday?: getActivityResult[],
  Tuesday?: getActivityResult[],
  Wednesday?: getActivityResult[],
  Thursday?: getActivityResult[],
  Friday?: getActivityResult[],
  Saturday?: getActivityResult[],
  Sunday?: getActivityResult[],
}

/**
 * Service class for managing activity operations.
 */
class ScheduleService {
  private activityRepository: Repository<Activity> = AppDataSource.getRepository(Activity);

  /**
   * Retrieves all activities for a given user and (if provided) for a given weekday.
   * @param userId The ID of the user.
   * @param dayName (if provided) The specific week day of which to fetch all activities.
   * @returns An object containing activities needed information.
   */
  public async getAllActivities(userId: number, dayName?: string) {
    if (!dayName) {
      const activities: Activity[] = await this.activityRepository.createQueryBuilder('activities')
      .leftJoinAndSelect('activities.creator', 'user')
      .where('user_id = :userId', { userId })
      .orderBy('activities.timestamp', 'ASC')
      .getMany();
      const result: getScheduleResult = {};
      result.Monday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Monday'));
      result.Tuesday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Tuesday'));
      result.Wednesday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Wednesday'));
      result.Thursday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Thursday'));
      result.Friday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Friday'));
      result.Saturday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Saturday'));
      result.Sunday = this.parseActivities(this.filterActivitiesByWeekDay(activities, 'Sunday'));

      return result;
    } else {
      const activities: Activity[] = await this.activityRepository.createQueryBuilder('activities')
      .leftJoinAndSelect('activities.creator', 'user')
      .where('user_id = :userId', { userId })
      .andWhere('week_day = :weekDay', { weekDay: dayName })
      .orderBy('activities.timestamp', 'ASC')
        .getMany();
      
      return this.parseActivities(activities);
    }
  }

  /**
   * Adds a new activity.
   * @param activityData The activity DTO containing activity data to be added.
   * @returns A promise that resolves to the result of adding new activity.
   */
  public async addActivity(activityData: ActivityDto) {
    await this.activityRepository.createQueryBuilder('activity').insert().into(Activity).values({
      name: activityData.name,
      week_day: activityData.dayName,
      timestamp: activityData.time,
      url: activityData.url ? activityData.url : '',
      creator: {
        id: activityData.userId
      }
    }).execute();
    return 'Success';
  }

  /**
   * Updates an existing Activity.
   * @param activityData The Activity DTO containing Activity data to be updated.
   * @returns A promise that resolves to the result of updated activity operation.
   * @throws Error if no Activity with the specified ID is found or user ID doesn't match.
   */
  public async updateActivity(activityData: ActivityDto) {
    const activity: Activity | null = await this.activityRepository.findOne({
      where: {
        id: activityData.id,
        creator: { id: activityData.userId }
    }});
    if (!activity) {
      throw new Error(`No Activity matches ID ${activityData.id}.`);
    }

    this.activityRepository.merge(activity, { name: activityData.name, week_day: activityData.dayName, timestamp: activityData.time, url: activityData.url });
    
    await this.activityRepository.save(activity);

    return 'Success';
  }
 
  /**
   * Deletes an existing activity.
   * @param activityData The activity DTO containing activity data to be deleted.
   * @returns A promise that resolves to the result of the deletion operation.
   * @throws Error if no Activity with the specified ID is found or user ID doesn't match.
   */
  public async deleteActivity(activityData: ActivityDto) {
    const activity: Activity | null = await this.activityRepository.findOne({
      where: {
        id: activityData.id,
        creator: { id: activityData.userId }
    }});
    if (!activity) {
      throw new Error(`No Activity matches ID ${activityData.id}.`);
    }
    // @ts-ignore
    const result: DeleteResult = await this.activityRepository.delete(activityData.id);
    if (result.affected === 1) {
      return { message: 'Success' };
    } else {
      return { message: 'Fail' };
    }
  }

  /**
   * Filters activities by week day.
   * @param activities The activities that have to be filtered.
   * @param weekDay A name of day by which to filter activities.
   * @returns Activities which have weekDay property the same as the provided weekDay param.
   */
  private filterActivitiesByWeekDay(activities: Activity[], weekDay: string): Activity[] {
    return activities.filter(activity => activity.week_day === weekDay);
  }

  /**
   * Parses activities and returns only needed info about each of them.
   * @param activities The activities that have to be parsed.
   * @returns The array of only needed activities info.
   */
  private parseActivities(activities: Activity[]): getActivityResult[] {
    return activities.map(activity => ({ id: activity.id, name: activity.name, weekDay: activity.week_day, url: activity.url, time: activity.timestamp }));
  }
}

export default ScheduleService;