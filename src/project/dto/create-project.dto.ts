import { IsEnum, IsString } from 'class-validator';

export enum AccessLevel {
  public = 'public',
  private = 'private',
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsEnum(AccessLevel)
  accessLevel: AccessLevel;
}
