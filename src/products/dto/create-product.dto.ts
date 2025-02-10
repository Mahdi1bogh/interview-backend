/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsArray, IsNotEmpty, IsNumber, IsString, } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message:"Name is required"})
    @IsString()
    name:string;
    
    @IsNotEmpty({message:"description is required"})
    @IsString()
    description:string;

    @IsNotEmpty({message:"price is required"})
    @IsNumber({},{message:"Price must be a number"})
    price:number;

    @IsNotEmpty({message:"supply is required"})
    @IsNumber({},{message:"supply must be a number"})
    supply:number;

    @IsNotEmpty({message:"Name is required"})
    @IsArray({message:"images should be an array"})
    images:string[]

    @IsNotEmpty({message:"category is required"})
    @IsNumber({},{message:"category id must be a number"})
    categoryId:number

    // @IsNotEmpty({message:"addedBy is required"})
    // @IsNumber({},{message:"addedBy id must be a number"})
    // addedBy:number
}
