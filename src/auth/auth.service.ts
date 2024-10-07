
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
    // const jwtSecret = this.configService.get<string>('JWT_SECRET');
    // console.log(`JWT Secret: ${jwtSecret}`);
  ) {}
 
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    return user.save();
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
