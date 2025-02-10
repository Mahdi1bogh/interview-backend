/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from "class-validator";
import { SigninUserDto } from "./signin-user.dto";

export class CreateUserDto extends SigninUserDto {
    @IsNotEmpty({message:"Name is required"})
    @IsString({message:"Name must be a string"})
    name: string;

}
