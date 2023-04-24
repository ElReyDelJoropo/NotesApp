import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;
@Schema()
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  accessLevel: 'public' | 'private';

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  author: string;
}

const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.virtual('notes', {
  ref: 'Note',
  localField: 'id',
  foreignField: 'projectId',
});

export { ProjectSchema };
