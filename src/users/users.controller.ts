import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { SigninUserDto } from './dto/signin-user.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { Roles } from './user-roles.enum';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto):Promise<Omit<UserEntity, "password">> {
    return await this.usersService.signup(body); ;
  }
  @Post('signin')
  async signin(@Body() userSignin: SigninUserDto):Promise<{user:Omit<UserEntity, "password"> , accessToken:string}> {
    const user = await this.usersService.signin(userSignin); 
    const accessToken= this.usersService.accessToken(user);
    return {user, accessToken};
  }
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Get("all")
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log('id', id);
  //   return this.usersService.findOne(Number(id));
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @UseGuards(AuthenticationGuard) 
  @Get("me")
  getProfile(@CurrentUser() currentUser:UserEntity){
    return currentUser
  }
}
