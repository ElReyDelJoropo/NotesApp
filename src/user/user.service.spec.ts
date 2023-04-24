import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'src/app.repositories';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { FakeUserRepository } from './repositories/fake.user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let randomUser: CreateUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: Repository.user, useClass: FakeUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    randomUser = FakeUserRepository.generateRandomUserDto();
  });

  describe('Checking invariants', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be empty', async () => {
      const users = await service.findAll();
      expect(users).toStrictEqual<UserDto[]>([]);
    });
  });

  describe('Creating', () => {
    it('Successfully created', async () => {
      const user = await service.create(randomUser);

      expect(user).toMatchObject<User>({
        ...randomUser,
        id: expect.any(String),
      });
    });

    it('Given user with same email as another, system should reject to create it', async () => {
      await service.create(randomUser);

      expect(service.create(randomUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Finding', () => {
    it('Given a valid id, user is found successfully', async () => {
      const user = await service.create(randomUser);
      const exist = await service.findOne(user.id);

      expect(exist).toStrictEqual({ ...user, projects: [] });
    });

    it('Given a valid id but that user doesnt not exist', async () => {
      const randomUser = FakeUserRepository.generateRandomUser();
      const exist = await service.findOne(randomUser.id);

      expect(exist).toBe(null);
    });
  });
});
