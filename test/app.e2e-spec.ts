import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'src/app.repositories';
import { FakeUserRepository } from 'src/user/repositories/fake.user.repository';
import { FakeNoteRepository } from 'src/note/repositories/fake.note.repository';
import { FakeProjectRepository } from 'src/project/repositories/fake.project.repository';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NoteService } from 'src/note/note.service';
import { NoteDto } from 'src/note/dto/note.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let noteService: NoteService;
  let jwtService: JwtService;

  const badRequestErrorResponse = {
    statusCode: 400,
    error: 'Bad Request',
    message: expect.any(Array<string>),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Repository.user)
      .useClass(FakeUserRepository)
      .overrideProvider(Repository.note)
      .useClass(FakeNoteRepository)
      .overrideProvider(Repository.project)
      .useClass(FakeProjectRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    userService = moduleFixture.get(UserService);
    noteService = moduleFixture.get(NoteService);
    jwtService = moduleFixture.get(JwtService);

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/auth/register (POST)', () => {
    const url = '/auth/register';
    it('Given an empty body, registration should be rejected with a bad request error', async () => {
      return await request(app.getHttpServer())
        .post(url)
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(badRequestErrorResponse);
        });
    });

    it('Given all required parameters, registration should be successfully', async () => {
      const createUserDto = FakeUserRepository.generateRandomUserDto();

      return await request(app.getHttpServer())
        .post(url)
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject<UserDto>({
            ...createUserDto,
            email: createUserDto.email.toLowerCase(),
            id: expect.any(String),
            projects: [],
          });
        });
    });
  });

  describe('/auth/login (POST)', () => {
    const url = '/auth/login';

    it('Given valid credentials but user does not exist, should be rejected with status code 400', async () => {
      const userDto = FakeUserRepository.generateRandomUser();
      return await request(app.getHttpServer())
        .post(url)
        .send({ email: userDto.email, password: userDto.password })
        .expect(400);
    });

    it('Given valid credential user login successfully', async () => {
      const createUserDto = FakeUserRepository.generateRandomUserDto();
      await userService.create(createUserDto);

      return await request(app.getHttpServer())
        .post(url)
        .send({
          email: createUserDto.email,
          password: createUserDto.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });
  });

  describe('/note/user (GET)', () => {
    it('Fetching user notes should return 401', async () => {
      return await request(app.getHttpServer()).get('/note/user').expect(401);
    });

    it('Fetching user notes with valid access token should return all user notes', async () => {
      const createUserDto = FakeUserRepository.generateRandomUserDto();
      const user = await userService.create(createUserDto);
      const access_token = jwtService.sign({ email: user.email, sub: user.id });
      const note = await noteService.create(
        FakeNoteRepository.generateRandomNoteDto(),
        user.id,
      );

      return await request(app.getHttpServer())
        .get('/note/user')
        .set('Authorization', `bearer ${access_token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([note]);
        });
    });
  });

  describe('/note/ (POST)', () => {
    const url = '/note';
    let user: User;
    let access_token: string;
    let createNoteDto: CreateNoteDto;

    beforeAll(async () => {
      const createUserDto = FakeUserRepository.generateRandomUserDto();
      createNoteDto = FakeNoteRepository.generateRandomNoteDto();

      user = await userService.create(createUserDto);
      access_token = jwtService.sign({ email: user.email, sub: user.id });
    });

    it('Given an unauthenticated user trying to create a note should be rejected with 401', async () => {
      return await request(app.getHttpServer())
        .post(url)
        .send(createNoteDto)
        .expect(401);
    });

    it('Given an authorized user note creation should be successfully', async () => {
      return await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `bearer ${access_token}`)
        .send(createNoteDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject<NoteDto>({
            ...createNoteDto,
            id: expect.any(String),
            createdBy: user.id,
          });
        });
    });

    it('Given an authorized user note creation should be rejected because body is empty', async () => {
      return await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `bearer ${access_token}`)
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(badRequestErrorResponse);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
