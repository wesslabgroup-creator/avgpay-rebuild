// Initialize Google Gemini Client
import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
