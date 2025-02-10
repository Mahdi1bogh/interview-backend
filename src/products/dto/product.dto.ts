import { Expose, Transform, Type } from 'class-transformer';

export class ProductsDto {
  @Expose()
  totalProducts: number;
  @Expose()
  limit: number;
  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}

export class ProductList {
  @Expose({ name: 'product_id' })
  id: number;
  @Expose({ name: 'product_name' })
  name: string;

  @Expose({ name: 'product_description' })
  description: string;
  @Expose({ name: 'product_price' })
  price: number;
  @Expose({ name: 'product_supply' })
  supply: number;
  @Expose({ name: 'product_images' })
  @Transform(({ value }:{value:string}) => value.toString().split(','))
  images: string[];

  @Transform(({obj}:{obj:{category_id:number,category_title:string}}) => {
    return {
      id: obj.category_id ,
      title: obj.category_title,
    };
  })
  @Expose()
  category: { id: number; title: string }

  @Expose({ name: 'reviewcount' })
  review: number;
  @Expose({ name: 'avgrating' })
  rating: number;
}