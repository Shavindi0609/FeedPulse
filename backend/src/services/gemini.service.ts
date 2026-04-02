import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeFeedback = async (title: string, description: string) => {
  const prompt = `Analyze this product feedback. Return ONLY valid JSON with these fields: category, sentiment, priority_score (1-10), summary, tags.
  
  Feedback Title: ${title}
  Feedback Description: ${description}
  
  Note: category must be one of [Bug, Feature Request, Improvement, Other].
  sentiment must be one of [Positive, Neutral, Negative].`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
};