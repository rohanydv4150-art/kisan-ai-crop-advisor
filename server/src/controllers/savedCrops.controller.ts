import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service.js';

export class SavedCropsController {
  public static async listSavedCrops(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const list = await DatabaseService.getSavedCrops(userId);

      res.status(200).json({
        success: true,
        message: 'Saved crops retrieved successfully',
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async saveCrop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { crop_name, crop_category, notes, advisory_report_id } = req.body;

      const record = await DatabaseService.saveCrop(
        userId,
        crop_name,
        crop_category,
        notes,
        advisory_report_id
      );

      res.status(201).json({
        success: true,
        message: 'Crop saved successfully to bookmarks',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteSavedCrop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const deleted = await DatabaseService.deleteSavedCrop(id, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Saved crop bookmark not found or could not be removed',
          code: 'NOT_FOUND',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Saved crop removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
