import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { 
  cropAdvisorySchema,
  soilAdvisoryInputSchema,
  fertilizerAdvisoryInputSchema,
  irrigationAdvisoryInputSchema,
  diseaseAdvisoryInputSchema,
  chatMessageInputSchema,
  createConversationSchema,
  farmerProfileSchema,
  updateFarmerProfileSchema,
  savedCropSchema,
} from '../schemas/index.js';

import { ProfileController } from '../controllers/profile.controller.js';
import { AdvisoryController } from '../controllers/advisory.controller.js';
import { ChatController } from '../controllers/chat.controller.js';
import { WeatherController } from '../controllers/weather.controller.js';
import { SavedCropsController } from '../controllers/savedCrops.controller.js';
import { NotificationsController } from '../controllers/notifications.controller.js';
import { DashboardController } from '../controllers/dashboard.controller.js';

export const apiRouter = Router();

// ==========================================
// System Health
// ==========================================
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Agricultural Crop Advisory System is healthy',
    data: {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// ==========================================
// Farmer Profile Routes
// ==========================================
apiRouter.get('/profile', requireAuth, ProfileController.getProfile);
apiRouter.post('/profile', requireAuth, validateBody(farmerProfileSchema), ProfileController.updateProfile);
apiRouter.patch('/profile', requireAuth, validateBody(updateFarmerProfileSchema), ProfileController.updateProfile);

// ==========================================
// Crop & Agricultural Advisory Routes
// ==========================================
apiRouter.post('/advisory/crop', requireAuth, validateBody(cropAdvisorySchema), AdvisoryController.createCropAdvisory);
apiRouter.post('/advisory/soil', requireAuth, validateBody(soilAdvisoryInputSchema), AdvisoryController.createSoilAdvisory);
apiRouter.post('/advisory/fertilizer', requireAuth, validateBody(fertilizerAdvisoryInputSchema), AdvisoryController.createFertilizerAdvisory);
apiRouter.post('/advisory/irrigation', requireAuth, validateBody(irrigationAdvisoryInputSchema), AdvisoryController.createIrrigationAdvisory);
apiRouter.post('/advisory/disease', requireAuth, validateBody(diseaseAdvisoryInputSchema), AdvisoryController.createDiseaseAdvisory);

apiRouter.get('/advisory', requireAuth, AdvisoryController.listAdvisories);
apiRouter.get('/advisory/:id', requireAuth, AdvisoryController.getAdvisoryById);
apiRouter.delete('/advisory/:id', requireAuth, AdvisoryController.deleteAdvisory);

// ==========================================
// AI Agriculture Chatbot Routes
// ==========================================
apiRouter.get('/chat/conversations', requireAuth, ChatController.listConversations);
apiRouter.post('/chat/conversations', requireAuth, validateBody(createConversationSchema), ChatController.createConversation);
apiRouter.get('/chat/conversations/:id', requireAuth, ChatController.getConversation);
apiRouter.post('/chat/conversations/:id/messages', requireAuth, validateBody(chatMessageInputSchema), ChatController.sendMessage);
apiRouter.delete('/chat/conversations/:id', requireAuth, ChatController.deleteConversation);

// ==========================================
// Weather Routes
// ==========================================
apiRouter.get('/weather/current', WeatherController.getCurrentWeather);
apiRouter.get('/weather/forecast', WeatherController.getWeatherForecast);

// ==========================================
// Saved Crops Routes
// ==========================================
apiRouter.get('/saved-crops', requireAuth, SavedCropsController.listSavedCrops);
apiRouter.post('/saved-crops', requireAuth, validateBody(savedCropSchema), SavedCropsController.saveCrop);
apiRouter.delete('/saved-crops/:id', requireAuth, SavedCropsController.deleteSavedCrop);

// ==========================================
// Notifications Routes
// ==========================================
apiRouter.get('/notifications', requireAuth, NotificationsController.listNotifications);
apiRouter.patch('/notifications/:id/read', requireAuth, NotificationsController.markRead);

// ==========================================
// Dashboard Analytics Summary Route
// ==========================================
apiRouter.get('/dashboard/summary', requireAuth, DashboardController.getSummary);
