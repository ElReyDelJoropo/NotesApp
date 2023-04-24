import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './entities/note.schema';
import { Repository } from 'src/app.repositories';
import { MongoNoteRepository } from './repositories/mongo.note.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  controllers: [NoteController],
  providers: [
    NoteService,
    { provide: Repository.note, useClass: MongoNoteRepository },
  ],
  exports: [NoteService],
})
export class NoteModule {}
