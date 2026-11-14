import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service.js';
import { DatabaseService } from '../services/database.service.js';

export class ChatController {
  public static async listConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const list = await DatabaseService.getConversations(userId);

      res.status(200).json({
        success: true,
        message: 'Conversations retrieved successfully',
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { title, language } = req.body;
      const conv = await DatabaseService.createConversation(userId, title || 'New Farming Consultation', language || 'en');

      res.status(201).json({
        success: true,
        message: 'Conversation created successfully',
        data: conv,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const data = await DatabaseService.getConversationById(id, userId);

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Conversation not found',
          code: 'NOT_FOUND',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Conversation retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const conversationId = req.params.id;

      const result = await ChatService.processMessage(userId, {
        ...req.body,
        conversation_id: conversationId,
      });

      res.status(200).json({
        success: true,
        message: 'Message processed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const deleted = await DatabaseService.deleteConversation(id, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Conversation not found or could not be deleted',
          code: 'NOT_FOUND',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Conversation deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
