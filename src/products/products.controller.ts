import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, NotFoundException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/users/user-roles.enum';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsDto } from './dto/product.dto';
import { SerializeIncludes } from 'src/utils/interceptors/serialize.interceptor';
 type queryProps = {
  limit?: number;
  offset?: number;
  search?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
}
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post()
  create(@Body() createProductDto: CreateProductDto,@CurrentUser() currentUser:UserEntity):Promise<ProductEntity> {
    return this.productsService.create(createProductDto,currentUser);
  }

  @SerializeIncludes(ProductsDto)
  @Get()
  async findAll(@Query() query: queryProps): Promise<ProductsDto> {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity | null> {
    return await this.productsService.findOne(+id);
  }
  @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@CurrentUser() currentUser:UserEntity):Promise<ProductEntity> {
    return this.productsService.update(+id, updateProductDto,currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
  @Post(':id/purchase')
    async purchase(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        throw new NotFoundException('Invalid product ID');
      }
      return this.productsService.purchase(productId);
    }
}
