/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SigninUserDto {

    @IsNotEmpty({message:"Email is required"})
    @IsString({message:"Email must be a string"})
    email: string;

    @IsNotEmpty({message:"Password is required"})
    @MinLength(5,{message:"Password must be at least 5 characters"})
    password: string;
}
