import { Request, Response, NextFunction } from 'express';
import { AdvisoryService } from '../services/advisory.service.js';
import { DatabaseService } from '../services/database.service.js';

export class AdvisoryController {
  public static async createCropAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const report = await AdvisoryService.generateCropAdvisory(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Crop recommendations generated successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createSoilAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const report = await AdvisoryService.generateSoilAdvisory(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Soil advisory generated successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createFertilizerAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const report = await AdvisoryService.generateFertilizerAdvisory(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Fertilizer guidance generated successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createIrrigationAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const report = await AdvisoryService.generateIrrigationAdvisory(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Irrigation advisory generated successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createDiseaseAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const report = await AdvisoryService.generateDiseaseAdvisory(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Disease & pest evaluation generated successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async listAdvisories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const type = req.query.type as string | undefined;
      const search = req.query.search as string | undefined;

      const reports = await DatabaseService.getAdvisories(userId, type, search);

      res.status(200).json({
        success: true,
        message: 'Advisory reports retrieved successfully',
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAdvisoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const report = await DatabaseService.getAdvisoryById(id, userId);

      if (!report) {
        res.status(404).json({
          success: false,
          message: 'Advisory report not found',
          code: 'NOT_FOUND',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Advisory report retrieved successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const deleted = await DatabaseService.deleteAdvisory(id, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Advisory report not found or could not be deleted',
          code: 'NOT_FOUND',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Advisory report deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
