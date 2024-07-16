import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { FormUserDto } from '../user/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from 'src/permeson/invitation/invitation.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/permeson/role/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(user: FormUserDto): Promise<void> {
    await this.usersService.create(user);
  }

  async registerWithInvitation(user: FormUserDto): Promise<void> {
    const invitation = await this.invitationRepository.findOneBy({
      email: user.email,
    });
    if (!invitation)
      throw new HttpException('Only invited users can log in', 401);

    await this.usersService.create(user);
    const userCreated = await this.usersService.findByEmail(user.email);

    await Promise.all([
      this.roleRepository.save({
        userId: userCreated._id.toString(),
        permissionId: invitation.permissionId,
      }),
      this.invitationRepository.update(invitation._id.toString(), {
        accepted: true,
      }),
    ]);
  }

  async login(user: FormUserDto): Promise<string> {
    const { email, password } = user;
    const userFound = await this.usersService.findByEmail(email);

    if (!userFound) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await compare(password, userFound.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 401);
    }

    return this.jwtService.sign({ email }, { secret: process.env.JWT_SECRET });
  }
}
