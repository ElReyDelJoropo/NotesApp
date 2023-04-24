import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(10)
  password: string;
}
