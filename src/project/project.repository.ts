import { ProjectDto } from './dto/project.dto';
import { Project } from './entities/project.schema';

export interface ProjectRepository {
  create(project: Project): Promise<ProjectDto>;
  findAll(): Promise<Project[]>;
  findBy(params: Partial<Project>): Promise<ProjectDto[]>;
  findOne(id: string): Promise<ProjectDto | null>;
  delete(id: string): Promise<void>;
}
