import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  try {
    // Ensure city is a string
    if (!city || typeof city !== 'string') {
      return res.status(400).json({ error: 'City name is required and must be a string' });
    }

    // Get weather data
    const weatherData = await WeatherService.getWeatherForCity(city);
    
    // Save city to search history
    await HistoryService.addCity(city);
    
    return res.status(200).json(weatherData); // Ensure to return the response
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve weather data' });
    }
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_, res: Response) => { // Using `_` for unused `req`
  try {
    const history = await HistoryService.getCities();

    if (history.length === 0) {
      return res.status(200).json({ message: 'Search history is empty', data: history });
    }

    return res.status(200).json(history); // Ensure to return the response
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve search history' });
    }
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS *
// TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID is provided
  if (!id) {
    return res.status(400).json({ error: 'City ID is required' });
  }

  try {
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City deleted from history' }); // Ensure to return the response
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || 'Failed to delete city from history' });
    }
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;