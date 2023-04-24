import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'src/app.repositories';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { FakeNoteRepository } from './repositories/fake.note.repository';

describe('NoteController', () => {
  let controller: NoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        NoteService,
        { provide: Repository.note, useClass: FakeNoteRepository },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
