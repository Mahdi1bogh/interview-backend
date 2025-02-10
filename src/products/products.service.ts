import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
   constructor(
      @InjectRepository(ProductEntity)
      private productRepository: Repository<ProductEntity>,
      private readonly categoriesService: CategoriesService
    ) {}
  async create(createProductDto: CreateProductDto,currentUser:UserEntity):Promise<ProductEntity> {
      const category = await this.categoriesService.findOne(Number(createProductDto.categoryId));  
      if(!category){
        throw new NotFoundException('Category not found');
      }
      const product = this.productRepository.create(createProductDto);
      product.category = category;
      product.addedBy = currentUser;
      return await this.productRepository.save(product);
    }
  
  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({relations:{addedBy:true,category:true},select:{addedBy:{id:true,name:true,email:true},category:{id:true,title:true}}});
  }

  async findOne(id: number) {
    const prod = await this.productRepository.findOne({where:{id} ,relations:{addedBy:true,category:true},select:{addedBy:{id:true,name:true,email:true},category:{id:true,title:true}}});
    if(!prod){
      throw new NotFoundException('Product not found');
    }
    return prod;
  }

  async update(id: number, updateProductDto: Partial<UpdateProductDto>,currentUser:UserEntity):Promise<ProductEntity> {
    const product = await this.findOne(id);
    if(!product){
      throw new NotFoundException('Product not found');
    }
    Object.assign(product,updateProductDto);
    product.addedBy = currentUser;
    if(updateProductDto.categoryId){
      const category = await this.categoriesService.findOne(Number(updateProductDto.categoryId));  
      if(!category){
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
