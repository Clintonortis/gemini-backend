import { GoogleGenAI } from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

export const basicPromptStreamUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
) => {
  /*const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: basicPromptDto.prompt,
    config: {
      systemInstruction:
        'Responde unicamente en español pero en formato markdown.',
    },
  });*/

  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: basicPromptDto.prompt }],
      },
    ],
    config: {
      systemInstruction: {
        role: 'system',
        parts: [
          { text: `Responde únicamente en español y en formato Markdown` },
        ],
      },
    },
  });

  return response;
};
