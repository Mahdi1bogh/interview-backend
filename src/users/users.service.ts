/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash,compare } from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';
import { sign } from 'jsonwebtoken';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async signup(body: CreateUserDto): Promise<Omit<UserEntity, "password">> {
    const userExists = await this.userRepository.findOne({ where: { email: body.email } });
  
    if (userExists) {
      throw new BadRequestException("User already exists");
    }
  
    body.password = await hash(body.password, 10);
    const user = this.userRepository.create(body);
    const savedUser = await this.userRepository.save(user);
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
  async signin(userSignin: SigninUserDto): Promise<Omit<UserEntity, "password">> {
    const userExists = await this.userRepository.createQueryBuilder("users")
    .addSelect("users.password")
    .where('users.email=:email', {email: userSignin.email })
    .getOne();
    
    if (!userExists) {
      throw new BadRequestException("User already exists");
    }

    const passwordMatches = await compare(userSignin.password, userExists.password);
  
    if(!passwordMatches){
      throw new BadRequestException("Invalid password");
      }

   
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userExists;
    return userWithoutPassword;
  }
  create() {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({id:Number(id)});
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  accessToken(user: Omit<UserEntity, "password">): string {
    if (!user.id) {
        throw new Error("User ID is missing while generating token");
    }
    return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET + "", { expiresIn: '1d' });
}
}
