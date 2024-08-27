import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const city = req.body.city; // Assuming city name is provided in the request body
    const weatherData = await WeatherService.getWeatherData(city);

    // Save city to search history
    await HistoryService.addToHistory(city);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving weather data.' });
  }
});

// GET search history
router.get('/history', async (req, res) => {
  try {
    const searchHistory = await HistoryService.getSearchHistory();
    res.json(searchHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving search history.' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const historyId = req.params.id;
  try {
    await HistoryService.deleteFromHistory(historyId);
    res.json({ message: 'City deleted from search history.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting city from search history.' });
  }
});

export default router;