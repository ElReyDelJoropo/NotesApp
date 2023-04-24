import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/project/entities/project.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { User, UserDocument } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class MongoUserRespository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  findBy(params: Partial<User>): Promise<UserDto | null> {
    return this.userModel
      .findOne(params)
      .populate<{ projects: Project[] }>({
        path: 'projects',
      })
      .lean()
      .exec();
  }

  async create(user: User): Promise<UserDto> {
    const usr = await this.userModel.create(user);
    return usr.populate<{ projects: Project[] }>({
      path: 'projects',
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto | null> {
    return this.userModel
      .findOneAndUpdate({ id }, updateUserDto, {
        new: true,
      })
      .populate<{ projects: Project[] }>({
        path: 'projects',
      })
      .lean()
      .exec();
  }

  findOne(id: string): Promise<UserDto | null> {
    return this.findBy({ id });
  }

  findAll(): Promise<UserDto[]> {
    return this.userModel
      .find()
      .populate<{ projects: Project[] }>({
        path: 'projects',
      })
      .lean()
      .exec();
  }
}
