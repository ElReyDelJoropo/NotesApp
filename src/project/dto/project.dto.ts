import { NoteDto } from 'src/note/dto/note.dto';

export class ProjectDto {
  name: string;

  accessLevel: 'public' | 'private';

  id: string;

  author: string;

  notes?: NoteDto[];
}
