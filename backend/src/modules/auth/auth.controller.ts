import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // Route HTTP POST /auth/signup
    @Post('signup')
    async signup(
        // Récupère le contenu de la requête
        @Body() signupDto: SignupDto
    ) { 
        // Appelle la méthode signup du service
        const result = await this.authService.signup(signupDto.name, signupDto.email, signupDto.password);
        return { message: 'User created!', userId: result.id };
    }

    // Route HTTP POST /auth/login
    @Post('login')
    async login(
        // Récupère le contenu de la requête
        @Body() loginDto: LoginDto
    ) {
        // Appelle la méthode login du service
        const result = await this.authService.login(loginDto.email, loginDto.password);
        return { message: 'User logged in!', token: result };
    }

}
