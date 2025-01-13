import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    async getUsers() {

        try {
            const users = await this.usersRepository.find();

            const usersWithoutPassword = users.map(user => {
                delete user.password;
                return user;
            });

            return usersWithoutPassword;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async getUser(id: string) {

        try {
            const user = await this.usersRepository.findOne({ where: { id: id } });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            delete user.password;

            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async createUser(name: string, email: string, password: string, role: string) {

        const existingUser = await this.usersRepository.findOne({ where: { email } });

        if (existingUser) {
            throw new HttpException(
                'E-Mail address already exists!',
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = new User();

        const hashedPassword = await bcrypt.hash(password, 12);

        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.role = role;

        try {
            const result = await this.usersRepository.save(user);

            delete result.password;

            return result;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async updateUser(id: string, name: string, email: string, password: string, role: string) {

        const user = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        if (password === '') {
            password = user.password;
        } else {
            let newPassword = password.trim();

            if (newPassword.length < 5) {
                throw new HttpException('Password must be at least 5 characters long.', HttpStatus.BAD_REQUEST);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;

        }

        user.name = name;
        user.email = email;

        const currentUserId = user.id;

        if (currentUserId === id && role !== user.role) {
            throw new HttpException('You cannot change your own role!', HttpStatus.BAD_REQUEST);
        } else if (role) {
            user.role = role;
        }

        try {
            const result = await this.usersRepository.save(user);

            delete result.password;

            return result;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async deleteUser(id: string) {

        const user = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const currentUserId = user.id;

        if (currentUserId === id) {
            throw new HttpException('You cannot delete your own user.', HttpStatus.BAD_REQUEST);
        }

        try {

            const result = await this.usersRepository.remove(user);
            return result;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}