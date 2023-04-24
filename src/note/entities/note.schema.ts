import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  versionKey: false,
})
export class Note {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  projectId?: string;
}

const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.virtual('author', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: 'id',
});
NoteSchema.virtual('project', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: 'id',
});

export { NoteSchema };
