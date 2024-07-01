import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ShortenerDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}

export class UpdateShortenerDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  newOriginalUrl: string;
}
