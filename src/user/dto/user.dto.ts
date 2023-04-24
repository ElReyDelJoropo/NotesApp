import { Exclude } from 'class-transformer';
import { Project } from 'src/project/entities/project.schema';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends CreateUserDto {
  id: string;

  projects: Project[];

  @Exclude()
  password: string;
}
