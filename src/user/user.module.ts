import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Repository } from 'src/app.repositories';
import { MongoUserRespository } from './repositories/mongo.user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: Repository.user,
      useClass: MongoUserRespository,
    },
  ],
  exports: [UserService, Repository.user],
})
export class UserModule {}
