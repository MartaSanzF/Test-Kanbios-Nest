import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    async signup(name: string, email: string, password: string) {

        const existingUser = await this.usersRepository.findOne({ where: { email } });

        if (existingUser) {
            throw new HttpException(
                'E-Mail address already exists!',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [users, usersCount] = await this.usersRepository.findAndCount();

        const userRole = usersCount === 0 ? 'admin' : 'user';

        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.role = userRole;

        try {
            const result = await this.usersRepository.save(user);
            return result;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async login(email: string, password: string) {

        const user = await this.usersRepository.findOneBy({ email: email });
        let loadedUser;

        if (!user) {
            throw new HttpException('A user with this email could not be found.', HttpStatus.NOT_FOUND);
        }

        loadedUser = user;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('Wrong password!', HttpStatus.UNAUTHORIZED);
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser.id,
                userName: loadedUser.name,
                role: loadedUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return token;
    }

}