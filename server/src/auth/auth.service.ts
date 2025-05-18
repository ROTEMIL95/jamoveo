import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignupDto, role: 'player' | 'admin'): Promise<User> {
    if (role === 'admin') {
      const existingAdmin = await this.usersService.findByRole('admin');
      if (existingAdmin) {
        throw new Error('Admin user already exists');
      }
    }
  
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) {
      throw new Error('User already exists');
    }
  
    const userWithRole = { ...dto, role };
    const newUser = await this.usersService.create(userWithRole);
    return newUser;
  }
  
  async signupAdmin(dto: SignupDto): Promise<User> {
    return this.signup(dto, 'admin');
  }
  

  async login(dto: LoginDto): Promise<{ message: string; user: User }> {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user || user.password !== dto.password) {
      throw new Error('Invalid credentials');
    }

    return { message: 'Login successful', user: user };
  }
}
