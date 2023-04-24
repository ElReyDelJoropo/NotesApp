import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'src/app.repositories';
import { v4 as uuidv4 } from 'uuid';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './note.repository';

@Injectable()
export class NoteService {
  constructor(
    @Inject(Repository.note) private readonly noteRepository: NoteRepository,
  ) {}
  create(createNoteDto: CreateNoteDto, userId: string, projectId?: string) {
    return this.noteRepository.create({
      ...createNoteDto,
      id: uuidv4(),
      createdBy: userId,
      projectId: projectId ?? '',
    });
  }

  findAll(populate?: boolean) {
    return this.noteRepository.findAll(populate);
  }

  findOne(id: string) {
    return this.noteRepository.findOne(id);
  }

  findById(userId: string) {
    return this.noteRepository.findByUserId(userId);
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return this.noteRepository.update(id, updateNoteDto);
  }

  remove(id: string) {
    return this.noteRepository.delete(id);
  }
}
