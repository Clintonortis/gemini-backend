import { GoogleGenAI, type Content } from '@google/genai';
import { ChatPromptDto } from '../dtos/chat-prompt.dto';

interface Options {
  model?: string;
  systemInstruction?: string;
  history?: Content[];
}

export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options,
) => {
  const { prompt } = chatPromptDto;

  const {
    model = 'gemini-2.5-flash',
    history = [],
    systemInstruction = 'Responde únicamente en español pero en formato markdown.',
  } = options ?? {};

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: history,
  });

  return chat.sendMessageStream({
    message: prompt,
  });
};
