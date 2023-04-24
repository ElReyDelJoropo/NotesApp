import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

export interface UserRepository {
  create(user: User): Promise<UserDto>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto | null>;
  findAll(): Promise<UserDto[]>;
  findOne(id: string): Promise<UserDto | null>;
  findBy(params: Partial<User>): Promise<UserDto | null>;
}
