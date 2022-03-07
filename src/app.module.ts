import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoClient } from 'mongodb';
import { HttpModule, HttpService } from '@nestjs/axios'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import config from './config';
import { mapTo } from 'rxjs';


const uri = 'mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary';

const client = new MongoClient(uri);
async function run() {
  await client.connect();
  const database = client.db('platzi-store');
  const taskCollection = database.collection('task');
  const tasks = await taskCollection.find().toArray();
  console.log(tasks);
}
run();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    HttpModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        const tasks = await http
          .get('https://jsonplaceholder.typicode.com/todos');
        return tasks;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
