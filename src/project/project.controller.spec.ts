import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'src/app.repositories';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { FakeProjectRepository } from './repositories/fake.project.repository';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectService,
        { provide: Repository.project, useClass: FakeProjectRepository },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
