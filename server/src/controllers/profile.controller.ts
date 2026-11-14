import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service.js';

export class ProfileController {
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      let profile = await DatabaseService.getProfile(userId);

      // If farmer profile doesn't exist yet, initialize standard record
      if (!profile) {
        profile = await DatabaseService.upsertProfile(userId, {
          full_name: req.user!.email ? req.user!.email.split('@')[0] : 'Farmer',
          preferred_language: 'en',
          land_unit: 'acre',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Farmer profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await DatabaseService.upsertProfile(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Farmer profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
