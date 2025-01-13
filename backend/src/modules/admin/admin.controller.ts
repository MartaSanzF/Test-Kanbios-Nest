import { Controller, Get, Post, Body, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { createUserDto } from './dto/createUser.dto';
import { updateUserDto } from './dto/updateUser.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('getUsers')
    @UseGuards(AuthGuard, RolesGuard)
    getUsers() {
        return this.adminService.getUsers();
    }

    @Get('getUser/:id')
    @UseGuards(AuthGuard, RolesGuard)
    getUser(@Req() req) {
        return this.adminService.getUser(req.params.id);
    }

    @Post('createUser')
    @UseGuards(AuthGuard, RolesGuard)
    async createUser(
        @Body() createUserDto: createUserDto,
        @Body('role') role: string
    ) {
        const result = await this.adminService.createUser(createUserDto.name, createUserDto.email, createUserDto.password, role);
        return { message: 'User created by admin!', userId: result.id };
    }

    @Put('updateUser/:id')
    @UseGuards(AuthGuard, RolesGuard)
    async updateUser(
        @Req() req,
        @Body() updateUserDto: updateUserDto,
        @Body('role') role: string,
        @Body('password') password: string
    ) {
        const result = await this.adminService.updateUser(req.params.id, updateUserDto.name, updateUserDto.email, password, role);
        return { message: 'User updated!', userId: result.id };
    }

    @Delete('deleteUser/:id')
    @UseGuards(AuthGuard, RolesGuard)
    async deleteUser(@Req() req) {
        const result = await this.adminService.deleteUser(req.params.id);
        return { message: 'User deleted!', userId: result.id };
    }

}
