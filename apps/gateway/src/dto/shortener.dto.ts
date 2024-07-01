import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
