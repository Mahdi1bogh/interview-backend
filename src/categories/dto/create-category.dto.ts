/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto  {
    @IsNotEmpty({message:"Name is required"})
    @IsString({message:"Name must be a string"})
    title: string;
    @IsNotEmpty({message:"Description is required"})
    @IsString({message:"Description must be a string"})
    description: string;

}
