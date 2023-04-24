import { faker } from '@faker-js/faker';
import { AccessLevel, CreateProjectDto } from '../dto/create-project.dto';
import { Project } from '../entities/project.schema';
import { ProjectRepository } from '../project.repository';

export class FakeProjectRepository implements ProjectRepository {
  private projects: Project[] = [];

  async create(project: Project): Promise<Project> {
    this.projects.push(project);
    return project;
  }
  async findAll(): Promise<Project[]> {
    return this.projects;
  }
  async findBy(params: Partial<Project>): Promise<Project[]> {
    return this.projects.filter(
      (project) =>
        project.name === params.name ||
        project.author === params.author ||
        project.id === params.id,
    );
  }
  async findOne(id: string): Promise<Project | null> {
    return this.projects.find((project) => project.id === id) || null;
  }
  async delete(id: string): Promise<void> {
    this.projects = this.projects.filter((project) => project.id !== id);
  }

  static generateRandomProjectDto(accessLevel?: AccessLevel): CreateProjectDto {
    return {
      name: faker.name.fullName(),
      accessLevel: accessLevel ?? AccessLevel.public,
    };
  }
}
