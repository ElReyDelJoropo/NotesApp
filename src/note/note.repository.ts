import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.schema';

export interface NoteRepository {
  create(note: Note): Promise<Note>;

  findAll(populate?: boolean): Promise<Note[]>;
  findByUserId(userId: string): Promise<Note[]>;
  findOneBy(params: UpdateNoteDto, populate?: boolean): Promise<Note | null>;
  findOne(id: string, populate?: boolean): Promise<Note | null>;

  update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note | null>;

  delete(id: string): Promise<void>;
}
