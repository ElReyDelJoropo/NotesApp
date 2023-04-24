import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { Note } from '../entities/note.schema';
import { NoteRepository } from '../note.repository';

@Injectable()
export class FakeNoteRepository implements NoteRepository {
  private notes: Note[] = [];

  async findOneBy(params: UpdateNoteDto): Promise<Note | null> {
    return this.notes.find((note) => note.title === params.title) || null;
  }

  async findByUserId(noteId: string): Promise<Note[]> {
    return this.notes.filter((note) => note.createdBy === noteId);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index === -1) return null;

    this.notes[index] = { ...this.notes[index], ...updateNoteDto };

    return this.notes[index];
  }

  async findOne(id: string): Promise<Note | null> {
    return this.notes.find((note) => note.id === id) || null;
  }

  async create(note: Note): Promise<Note> {
    this.notes.push(note);
    return note;
  }

  async findAll(): Promise<Note[]> {
    return this.notes;
  }

  async delete(id: string): Promise<void> {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  static generateRandomNoteDto(): CreateNoteDto {
    return {
      title: faker.lorem.sentence(),
      text: faker.lorem.text(),
    };
  }
}
