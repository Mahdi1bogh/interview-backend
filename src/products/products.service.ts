import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateProductDto } from './dto/update-product.dto';
import dataSource from 'db/data-source';
import { ProductList } from './dto/product.dto';

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
  
    async findAll(
      query: {
        limit?: number;
        offset?: number;
        search?: string;
        category?: number;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        maxRating?: number;
      },
    ): Promise<{
      products: ProductList[];
      totalProducts: number;
      limit: number;
    }> {
      let limit: number;
    
      if (!query.limit) {
        limit = 4;
      } else {
        limit = query.limit;
      }
    
      const queryBuilder = dataSource
        .getRepository(ProductEntity)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoin('product.reviews', 'review')
        .addSelect([
          'COUNT(review.id) AS reviewCount',
          'AVG(review.ratings)::numeric(10,2) AS avgRating',
        ])
        .groupBy('product.id,category.id');
    
      if (query.search) {
        const search = query.search.toLowerCase();
        queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:name)', {
          name: `%${search}%`,
        });
      }
    
      if (query.category) {
        queryBuilder.andWhere('category.id=:id', { id: query.category });
      }
    
      if (query.minPrice) {
        queryBuilder.andWhere('product.price>=:minPrice', {
          minPrice: query.minPrice,
        });
      }
      if (query.maxPrice) {
        queryBuilder.andWhere('product.price<=:maxPrice', {
          maxPrice: query.maxPrice,
        });
      }
    
      if (query.minRating) {
        queryBuilder.andHaving('AVG(review.ratings)>=:minRating', {
          minRating: query.minRating,
        });
      }
    
      if (query.maxRating) {
        queryBuilder.andHaving('AVG(review.ratings) <=:maxRating', {
          maxRating: query.maxRating,
        });
      }
    
      queryBuilder.limit(limit);
    
      if (query.offset) {
        queryBuilder.offset(query.offset);
      }
    
      const products: ProductList[] = await queryBuilder.getRawMany();
    
      return { products, totalProducts: products.length, limit };
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
  async purchase(id: number): Promise<{ success: boolean; message: string }> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supply > 0) {
      product.supply--;
      await this.productRepository.save(product);
      return { success: true, message: 'Purchase successful!' };
    }

    return { success: false, message: 'Product out of stock!' };
  }
}
