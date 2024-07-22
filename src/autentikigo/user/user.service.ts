import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { hash } from 'bcrypt';
import { FormUserDto } from './user.dto';
import { FormSignupDto } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: FormUserDto | FormSignupDto): Promise<void> {
    const hashedPassword = await hash(user.password, 10);
    await this.userRepository.save({ ...user, password: hashedPassword });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
}
