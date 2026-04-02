import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import { analyzeFeedback } from '../services/gemini.service';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // 1. Basic Validation (Requirement 1.3)
    if (!title || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Title is required and description must be at least 20 characters."
      });
    }

    // 2. Database එකේ මුලින්ම Save කරගන්න (Requirement 2.3 - AI fail වුණත් data තියෙන්න ඕන නිසා)
    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    const savedFeedback = await newFeedback.save();

    // 3. Gemini AI හරහා Analyze කිරීම (Requirement 2.1 & 2.2)
    try {
      const aiAnalysis = await analyzeFeedback(title, description);

      if (aiAnalysis) {
        savedFeedback.ai_category = aiAnalysis.category;
        savedFeedback.ai_sentiment = aiAnalysis.sentiment;
        savedFeedback.ai_priority = aiAnalysis.priority_score;
        savedFeedback.ai_summary = aiAnalysis.summary;
        savedFeedback.ai_tags = aiAnalysis.tags;
        savedFeedback.ai_processed = true;

        await savedFeedback.save();
      }
    } catch (aiError) {
      console.error("AI processing failed, but feedback was saved:", aiError);
    }

    // 4. Response එක යැවීම (Requirement 4.1)
    res.status(201).json({
      success: true,
      data: savedFeedback,
      message: "Feedback submitted successfully!"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error
    });
  }
};