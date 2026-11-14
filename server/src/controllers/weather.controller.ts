import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service.js';

export class WeatherController {
  public static async getCurrentWeather(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const state = req.query.state as string | undefined;
      const district = req.query.district as string | undefined;
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
      const lon = req.query.lon ? parseFloat(req.query.lon as string) : null;

      const weather = await WeatherService.getWeatherForLocation(state, district, lat, lon);

      res.status(200).json({
        success: true,
        message: weather.is_live ? 'Live meteorological observations retrieved' : 'Weather observation status',
        data: weather,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getWeatherForecast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const state = req.query.state as string | undefined;
      const district = req.query.district as string | undefined;
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
      const lon = req.query.lon ? parseFloat(req.query.lon as string) : null;

      const weather = await WeatherService.getWeatherForLocation(state, district, lat, lon);

      res.status(200).json({
        success: true,
        message: 'Weather forecast retrieved',
        data: {
          forecast: weather.forecast || [],
          is_live: weather.is_live,
          provider: weather.provider,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
