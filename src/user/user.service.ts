import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'src/app.repositories';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repository.user)
    private readonly userRepository: UserRepository,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const exist = await this.findBy({
      email: createUserDto.email,
    });
    if (exist)
      throw new BadRequestException(
        `User with email ${exist.email} already exist!`,
      );

    return this.userRepository.create({ ...createUserDto, id: uuidv4() });
  }

  findAll(): Promise<UserDto[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.userRepository.findOne(id);
  }

  async findBy(params: UpdateUserDto): Promise<UserDto | null> {
    return this.userRepository.findBy(params);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const exist = await this.userRepository.findOne(id);

    if (!exist) return null;

    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
