import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, FullReport, CalculatorReport, ChatMessage } from '../types';

const buildPrompt = (userInput: UserInput): string => {
  const calculatorSchema = {
      type: Type.OBJECT,
      properties: {
        expense_summary: {
          type: Type.OBJECT,
          properties: {
            rent: { type: Type.NUMBER },
            utilities: { type: Type.NUMBER },
            subscriptions: { type: Type.NUMBER },
            food: { type: Type.NUMBER },
            transport: { type: Type.NUMBER },
            entertainment: { type: Type.NUMBER },
            total_expenses: { type: Type.NUMBER },
            remaining_income: { type: Type.NUMBER }
          }
        },
        budget_suggestions: {
          type: Type.OBJECT,
          properties: {
            next_month_limit: { type: Type.NUMBER },
            adjustments: {
              type: Type.OBJECT,
              properties: {
                food: { type: Type.NUMBER },
                entertainment: { type: Type.NUMBER },
                subscriptions: { type: Type.NUMBER }
              }
            }
          }
        },
        savings_opportunities: {
          type: Type.OBJECT,
          properties: {
            expected_savings: { type: Type.NUMBER },
            actions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        debt_management: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING },
            monthly_payment: { type: Type.NUMBER },
            strategy: { type: Type.STRING }
          }
        },
        financial_tips: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        alerts: {
          type: Type.OBJECT,
          properties: {
            overspending_categories: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
  };

  const finalSchema = {
      type: Type.OBJECT,
      properties: {
          calculator_mode: calculatorSchema,
          advisor_mode: { type: Type.STRING, description: "Professional, friendly advice explaining the numbers from calculator_mode. Offer context, actionable recommendations, and financial tips in clear sentences. Ensure all advice matches the data and calculations from Calculator Mode." }
      },
      required: ['calculator_mode', 'advisor_mode']
  };

  const prompt = `
You are an AI Personal Finance Assistant. Analyze the user's financial data and generate a comprehensive report in two modes: Calculator and Advisor.
The final output MUST be a single, valid JSON object that adheres to the provided schema.

User's Financial Data:
${JSON.stringify(userInput, null, 2)}

Instructions:
1.  **Calculator Mode**: Generate a structured JSON report. All numbers and actions should be realistic and based on the input data. Do NOT include conversational sentences.
2.  **Advisor Mode**: Provide professional, friendly advice explaining the numbers. Offer context, actionable recommendations, and financial tips in clear sentences. This will be the FIRST message in a chat conversation. Ensure all advice matches the data from Calculator Mode.
`;

  return prompt;
};

export const generateFinancialReport = async (userInput: UserInput): Promise<FullReport> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = buildPrompt(userInput);

  const finalSchema = {
      type: Type.OBJECT,
      properties: {
          calculator_mode: {
            type: Type.OBJECT,
            properties: {
              expense_summary: { type: Type.OBJECT, properties: { rent: { type: Type.NUMBER }, utilities: { type: Type.NUMBER }, subscriptions: { type: Type.NUMBER }, food: { type: Type.NUMBER }, transport: { type: Type.NUMBER }, entertainment: { type: Type.NUMBER }, total_expenses: { type: Type.NUMBER }, remaining_income: { type: Type.NUMBER } } },
              budget_suggestions: { type: Type.OBJECT, properties: { next_month_limit: { type: Type.NUMBER }, adjustments: { type: Type.OBJECT, properties: { food: { type: Type.NUMBER }, entertainment: { type: Type.NUMBER }, subscriptions: { type: Type.NUMBER } } } } },
              savings_opportunities: { type: Type.OBJECT, properties: { expected_savings: { type: Type.NUMBER }, actions: { type: Type.ARRAY, items: { type: Type.STRING } } } },
              debt_management: { type: Type.OBJECT, properties: { priority: { type: Type.STRING }, monthly_payment: { type: Type.NUMBER }, strategy: { type: Type.STRING } } },
              financial_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
              alerts: { type: Type.OBJECT, properties: { overspending_categories: { type: Type.ARRAY, items: { type: Type.STRING } } } }
            }
          },
          advisor_mode: { type: Type.STRING }
      }
  };


  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: finalSchema,
    }
  });

  const rawJson = response.text.trim();
  
  try {
    const parsedJson = JSON.parse(rawJson);
    return parsedJson as FullReport;
  } catch (error) {
    console.error("Failed to parse JSON response:", rawJson);
    throw new Error("Received malformed JSON from the API.");
  }
};

export const getAdvisorResponse = async (
  userInput: UserInput,
  report: CalculatorReport,
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
You are an AI Personal Finance Assistant.
Your role is to answer follow-up questions based on the user's financial data and the initial analysis you provided.
DO NOT provide advice outside of the financial context provided. Keep your answers concise and directly related to the question.

Here is the user's original financial data:
${JSON.stringify(userInput, null, 2)}

Here is the data-driven report you generated:
${JSON.stringify(report, null, 2)}

Here is the conversation history so far:
${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}

New question from the user:
${newMessage}

Please provide a helpful and conversational response to the user's new question based ONLY on the context above.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text.trim();
};
