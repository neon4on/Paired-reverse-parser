import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  createGame(@Body() createGameDto: { N: number; M: number }) {
    try {
      return this.gameService.createGame(createGameDto.N, createGameDto.M);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
