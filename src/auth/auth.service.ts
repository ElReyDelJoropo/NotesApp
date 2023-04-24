import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: AuthDto) {
    const exist = await this.userService.findBy({ email });

    if (!exist) throw new BadRequestException(`User ${email} not found`);

    if (!this.comparePasswords(password, exist.password))
      throw new BadRequestException('Invalid password');

    return {
      access_token: await this.jwtService.signAsync({ email, sub: exist.id }),
    };
  }

  register(userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  private comparePasswords(lhs: string, rhs: string) {
    return lhs === rhs;
  }
}
