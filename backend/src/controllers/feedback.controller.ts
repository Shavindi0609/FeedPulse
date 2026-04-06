import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import { analyzeFeedback } from '../services/gemini.service';

// 1. Submit Feedback (Requirement 1.4 & 4.1)
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // Basic Validation (Requirement 1.3)
    if (!title || !description || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Title is required and description must be at least 20 characters."
      });
    }

    // Database එකේ Save කිරීම (Requirement 2.3)
    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    const savedFeedback = await newFeedback.save();

    // Gemini AI Analysis (Requirement 2.1 & 2.2)
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
      console.error("AI Error:", aiError);
    }

    res.status(201).json({ success: true, data: savedFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Get All Feedback for Admin (Requirement 3.2 & 4.1)
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (category) query.category = category;
    if (status) query.status = status;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({ success: true, total, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. Update Status (Requirement 3.5 & 4.1)
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};