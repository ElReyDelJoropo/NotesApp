import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'src/app.repositories';
import { Note } from './entities/note.schema';
import { NoteService } from './note.service';
import { FakeNoteRepository } from './repositories/fake.note.repository';

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: Repository.note, useClass: FakeNoteRepository },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Creating', () => {
    it('Sucessfully created note', async () => {
      const noteDto = FakeNoteRepository.generateRandomNoteDto();
      const id = faker.datatype.uuid();

      const note = await service.create(noteDto, id);

      expect(note).toMatchObject<Note>({
        ...noteDto,
        id: expect.any(String),
        createdBy: id,
        projectId: expect.any(String),
      });
    });
  });

  describe('Searching', () => {
    const creatingNotes = async (n: number, userId?: string) => {
      for (let i = 0; i != n; ++i) {
        const noteDto = FakeNoteRepository.generateRandomNoteDto();

        await service.create(noteDto, userId ?? faker.datatype.uuid());
      }
    };
    it('Given n random notes inserted expect to receive a size-n array', async () => {
      const n = Math.ceil(Math.random() * 20) + 1;
      await creatingNotes(n);

      const notes = await service.findAll();

      expect(notes).toHaveLength(n);
    });

    it('When there are no already created notes expect to receive empty array', async () => {
      const notes = await service.findAll();

      expect(notes).toHaveLength(0);
    });

    it('Given an user, when him request their notes, should receive only her notes', async () => {
      const totalUserNotes = 10;
      const totalOtherNotes = 20;
      const userId = faker.datatype.uuid();

      //First we created 10 user notes
      await creatingNotes(totalUserNotes, userId);
      //Then we create 20 notes with random user id
      await creatingNotes(totalOtherNotes);

      const allNotes = await service.findAll();
      const notes = await service.findById(userId);

      expect(allNotes).toHaveLength(totalUserNotes + totalOtherNotes);
      expect(notes).toHaveLength(totalUserNotes);
      expect(notes.some((note) => note.createdBy !== userId)).toBe(false);
    });
  });

  describe('Updating', () => {
    it('Sucessfully updated note', async () => {
      const userId = faker.datatype.uuid();
      const note = await service.create(
        FakeNoteRepository.generateRandomNoteDto(),
        userId,
      );

      const updatedNote = await service.update(note.id, {
        title: faker.random.words(10),
      });

      expect(updatedNote?.title).not.toBeNull();
      expect(updatedNote?.title).not.toBe(note.title);
    });

    it('Trying to update a noexistent note', async () => {
      const updateNote = await service.update(
        'this id doesnt exist',
        FakeNoteRepository.generateRandomNoteDto(),
      );

      expect(updateNote).toBeNull();
    });
  });
});
