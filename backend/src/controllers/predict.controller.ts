import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config/env';

export const predictParcel = async (req: Request, res: Response) => {
  try {
    const inputData = req.body;
    const flaskPredictUrl = `${config.flaskBaseUrl}/predict`;

    const flaskResponse = await axios.post(flaskPredictUrl, inputData, { timeout: 10000 });

    return res.json({
      success: true,
      ...flaskResponse.data,
    });
  } catch (error: any) {
    console.error('Error in /predict:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
