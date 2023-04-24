import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteDto } from 'src/note/dto/note.dto';
import { ProjectDto } from '../dto/project.dto';
import { Project, ProjectDocument } from '../entities/project.schema';
import { ProjectRepository } from '../project.repository';

export class MongoProjectRepository implements ProjectRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}
  create(project: Project): Promise<ProjectDto> {
    return this.projectModel.create(project);
  }
  findAll(): Promise<ProjectDto[]> {
    return this.projectModel.find();
  }
  findBy(params: Partial<Project>): Promise<ProjectDto[]> {
    return this.projectModel.find(params);
  }
  findOne(id: string): Promise<ProjectDto | null> {
    return this.projectModel
      .findOne({ id })
      .populate<{ notes: NoteDto[] }>({ path: 'notes' });
  }
  async delete(id: string): Promise<void> {
    this.projectModel.deleteOne({ id }).exec();
  }
}
