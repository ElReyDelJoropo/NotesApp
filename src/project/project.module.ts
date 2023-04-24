import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Repository } from 'src/app.repositories';
import { MongoProjectRepository } from './repositories/mongo.project.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.schema';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    NoteModule,
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    { provide: Repository.project, useClass: MongoProjectRepository },
  ],
})
export class ProjectModule {}
