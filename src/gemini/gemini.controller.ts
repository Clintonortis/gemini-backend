import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { GenerateContentResponse } from '@google/genai';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(
    res: Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>,
  ) {
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }

    res.end();
    return resultText;
  }

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    //TODO: files
  ) {
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    void this.outputStreamResponse(res, stream);
  }

  @Post('chat-stream')
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    //TODO: files
  ) {
    const stream = await this.geminiService.chatStream(chatPromptDto);
    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage = {
      role: 'model',
      parts: [{ text: data }],
    };

    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);
  }
  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      parts: message.parts?.map((part) => part.text).join(''),
    }));
  }
}
