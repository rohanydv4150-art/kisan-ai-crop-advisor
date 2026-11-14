import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service.js';

export class NotificationsController {
  public static async listNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const list = await DatabaseService.getNotifications(userId);

      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      await DatabaseService.markNotificationRead(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
}
