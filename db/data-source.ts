import { DataSource, DataSourceOptions } from "typeorm";
import {config} from "dotenv";
config()
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    url: process.env.POSTGRES_URL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    synchronize: true,
  }
  const dataSource = new DataSource(dataSourceOptions);

export default dataSource