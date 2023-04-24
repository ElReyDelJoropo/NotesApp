import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { Note, NoteDocument } from '../entities/note.schema';
import { NoteRepository } from '../note.repository';

export class MongoNoteRepository implements NoteRepository {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}
  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    return await this.noteModel
      .findOneAndUpdate({ id }, updateNoteDto, { new: true })
      // .orFail(new NotFoundException(`Note with id ${id} not found`))
      .lean()
      .exec();
  }
  async delete(id: string): Promise<void> {
    this.noteModel.findByIdAndDelete(id);
  }

  async create(note: Note): Promise<Note> {
    return this.noteModel.create(note);
  }
  findAll(populate?: boolean): Promise<Note[]> {
    return populate
      ? this.noteModel
          .find()
          .populate({
            path: 'author',
            select: 'name lastname email -id -_id',
          })
          .lean()
          .exec()
      : this.noteModel.find().select('-createdBy -projectId').lean().exec();
  }
  findByUserId(userId: string): Promise<Note[]> {
    return this.noteModel
      .find({ createdBy: userId })
      .select('-createdBy')
      .lean()
      .exec();
  }
  findOneBy(params: UpdateNoteDto, populate?: boolean): Promise<Note | null> {
    return populate
      ? this.noteModel.findOne(params).populate('author project').lean().exec()
      : this.noteModel.findOne(params).select('-author -project').lean().exec();
  }
  findOne(id: string, populate?: boolean): Promise<Note | null> {
    return populate
      ? this.noteModel.findOne({ id }).populate('author project').lean().exec()
      : this.noteModel.findOne({ id }).select('-author -project').lean().exec();
  }
}
