import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'src/app.repositories';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { NoteService } from 'src/note/note.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDto } from './dto/project.dto';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(Repository.project)
    private readonly projectRepository: ProjectRepository,
    private readonly noteService: NoteService,
  ) {}
  create(createProjectDto: CreateProjectDto, userId: string) {
    return this.projectRepository.create({
      ...createProjectDto,
      id: uuidv4(),
      author: userId,
    });
  }

  async insertNote(
    createNoteDto: CreateNoteDto,
    userId: string,
    projectId: string,
  ) {
    const project = await this.projectRepository.findOne(projectId);

    if (!project)
      throw new NotFoundException('Project with id ${projectId} not found');

    if (project.author !== userId) throw new ForbiddenException();

    return this.noteService.create(createNoteDto, userId, projectId);
  }

  findAll() {
    return this.projectRepository.findAll();
  }

  findOne(id: string) {
    return this.projectRepository.findOne(id);
  }

  findBy(params: Partial<ProjectDto>) {
    return this.projectRepository.findBy(params);
  }

  remove(id: string) {
    this.projectRepository.delete(id);
  }
}
