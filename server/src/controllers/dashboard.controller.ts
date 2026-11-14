import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service.js';

export class DashboardController {
  public static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      // Parallelize lookups
      const [profile, advisories, conversations, savedCrops, notifications] = await Promise.all([
        DatabaseService.getProfile(userId),
        DatabaseService.getAdvisories(userId),
        DatabaseService.getConversations(userId),
        DatabaseService.getSavedCrops(userId),
        DatabaseService.getNotifications(userId),
      ]);

      // Calculate advisory breakdown by type
      const typeBreakdown: Record<string, number> = {
        crop: 0,
        soil: 0,
        fertilizer: 0,
        irrigation: 0,
        disease: 0,
      };

      const cropFrequencyMap: Record<string, number> = {};

      for (const adv of advisories) {
        if (typeBreakdown[adv.advisory_type] !== undefined) {
          typeBreakdown[adv.advisory_type]++;
        } else {
          typeBreakdown[adv.advisory_type] = 1;
        }

        // Tally recommended crops
        if (adv.advisory_type === 'crop' && adv.ai_response) {
          const recs = (adv.ai_response as any).recommendations;
          if (Array.isArray(recs)) {
            for (const r of recs) {
              if (r.crop_name) {
                cropFrequencyMap[r.crop_name] = (cropFrequencyMap[r.crop_name] || 0) + 1;
              }
            }
          }
        }
      }

      // Convert crop frequency map to sorted array for Recharts
      const topRecommendedCrops = Object.entries(cropFrequencyMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Monthly activity timeline
      const activityMap: Record<string, number> = {};
      for (const adv of advisories) {
        const dateKey = adv.created_at.slice(0, 10);
        activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
      }
      const activityTimeline = Object.entries(activityMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14);

      res.status(200).json({
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: {
          profile: profile || {
            full_name: 'Farmer',
            land_unit: 'acre',
            preferred_language: 'en',
          },
          metrics: {
            total_advisories: advisories.length,
            total_conversations: conversations.length,
            total_saved_crops: savedCrops.length,
            unread_notifications: notifications.filter((n) => !n.is_read).length,
          },
          charts: {
            type_distribution: Object.entries(typeBreakdown).map(([name, count]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              count,
            })),
            top_crops: topRecommendedCrops,
            activity_timeline: activityTimeline,
          },
          recent_advisories: advisories.slice(0, 5),
          recent_conversations: conversations.slice(0, 5),
          saved_crops: savedCrops.slice(0, 5),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
