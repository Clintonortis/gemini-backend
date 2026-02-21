import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ChatPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsUUID()
  chatId: string;
}
