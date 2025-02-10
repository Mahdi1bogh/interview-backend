import { CategoryEntity } from "src/categories/entities/category.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
@Entity({name:'products'})
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    description:string

    @Column({default:0})
    price:number

    @Column()
    supply:number
    
    @Column('simple-array')
    images:string[];

    @CreateDateColumn()
    createdAt:Timestamp;
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @ManyToOne(()=>UserEntity,user=>user.products)
    addedBy:UserEntity

    @ManyToOne(()=>CategoryEntity,category=>category.products)
    category:CategoryEntity

    @OneToMany(() => ReviewEntity, (rev) => rev.product)
    reviews: ReviewEntity[];
}
