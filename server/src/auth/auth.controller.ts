import { Controller, Post, Body } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<User> {
    return await this.authService.signup(dto, 'player');
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ message: string; user: User }> {
    return await this.authService.login(dto);
  }

  @Post('admin/signup')
  async signupAdmin(@Body() dto: SignupDto): Promise<User>  {
    return await this.authService.signup(dto, 'admin');
  }
  
}
