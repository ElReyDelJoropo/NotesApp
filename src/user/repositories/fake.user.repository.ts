import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class FakeUserRepository implements UserRepository {
  private users: UserDto[] = [];

  async findBy(params: Partial<User>): Promise<UserDto | null> {
    return this.users.find((user) => user.email === params.email) || null;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...updateUserDto };

    return this.users[index];
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(user: User): Promise<UserDto> {
    const ret = { ...user, projects: [], email: user.email.toLowerCase() };
    this.users.push(ret);
    return ret;
  }

  async findAll(): Promise<UserDto[]> {
    return this.users;
  }

  static generateRandomUser(): UserDto {
    return {
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(20),
      id: faker.datatype.uuid(),
      projects: [],
    };
  }

  static generateRandomUserDto(): CreateUserDto {
    return {
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(20),
    };
  }
}
