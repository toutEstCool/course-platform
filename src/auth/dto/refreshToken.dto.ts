import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({
    message: 'Вы не передали токен, либо он не является строкой',
  })
  refreshToken: string;
}
