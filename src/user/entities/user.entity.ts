import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  lastname: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ unique: true })
  id: string;

  @Prop()
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('projects', {
  ref: 'Project',
  localField: 'id',
  foreignField: 'author',
});

UserSchema.virtual('notes', {
  ref: 'Note',
  localField: 'id',
  foreignField: 'createdBy',
});
export { UserSchema };
