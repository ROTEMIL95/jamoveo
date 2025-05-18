import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<User> {
    try {
      return await this.authService.signup(dto, 'player');
    } catch (error) {
      this.logger.error(`Signup failed: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to register user',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ message: string; user: User }> {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('admin/signup')
  async signupAdmin(@Body() dto: SignupDto): Promise<User>  {
    try {
      return await this.authService.signup(dto, 'admin');
    } catch (error) {
      this.logger.error(`Admin signup failed: ${error.message}`);
      throw new HttpException(
        error.message || 'Failed to register admin',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
