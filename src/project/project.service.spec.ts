import { faker } from '@faker-js/faker';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'src/app.repositories';
import { NoteService } from 'src/note/note.service';
import { FakeNoteRepository } from 'src/note/repositories/fake.note.repository';
import { Project } from './entities/project.schema';
import { ProjectService } from './project.service';
import { FakeProjectRepository } from './repositories/fake.project.repository';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let noteService: DeepMocked<NoteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: Repository.project, useClass: FakeProjectRepository },
      ],
    })
      .useMocker(createMock)
      .compile();

    projectService = module.get<ProjectService>(ProjectService);
    noteService = module.get(NoteService);
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });

  describe('Creating', () => {
    it('Project created successfully', async () => {
      const projectDto = FakeProjectRepository.generateRandomProjectDto();
      const userId = faker.datatype.uuid();

      const project = await projectService.create(projectDto, userId);

      expect(project).toMatchObject<Project>({
        ...projectDto,
        id: expect.any(String),
        author: userId,
      });
    });

    it('Inserting note', async () => {
      //Arrange
      const createNoteDto = FakeNoteRepository.generateRandomNoteDto();
      const createProjectDto = FakeProjectRepository.generateRandomProjectDto();
      const userId = faker.datatype.uuid();
      const project = await projectService.create(createProjectDto, userId);
      noteService.create.mockResolvedValueOnce({
        projectId: project.id,
        createdBy: userId,
        ...createNoteDto,
        id: faker.datatype.uuid(),
      });

      //Act
      const note = await projectService.insertNote(
        createNoteDto,
        userId,
        project.id,
      );

      //Assert
      expect(note.projectId).toBe(project.id);
    });
  });

  describe('Finding', () => {
    it('All projects', async () => {
      const allProjects = await projectService.findAll();

      expect(allProjects).toHaveLength(0);
    });

    const createProjects = async (n: number, id: string) => {
      const createProjectDto = FakeProjectRepository.generateRandomProjectDto();
      for (let i = 0; i != n; ++i) {
        await projectService.create(createProjectDto, id);
      }
    };

    it('All user projects', async () => {
      //Arrange
      const totalUserProjects = 20;
      const totalOtherProjects = 25;
      const id = faker.datatype.uuid();

      await createProjects(totalUserProjects, id);
      await createProjects(totalOtherProjects, 'this is other id');

      //Act
      const userProjects = await projectService.findBy({ author: id });

      //Assert
      expect(userProjects).toHaveLength(totalUserProjects);
      expect(userProjects.some((p) => p.author !== id)).toBe(false);
    });
  });
});
