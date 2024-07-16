import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AutentikigoModule } from './autentikigo/autentikigo.module';
import { PermesonModule } from './permeson/permeson.module';

import { User } from './autentikigo/user/user.entity';
import { Module as ModuleEntity } from './permeson/module/module.entity';
import { Permission } from './permeson/permission/permission.entity';
import { Invitation } from './permeson/invitation/invitation.entity';

import 'dotenv/config.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: process.env.DB_NAME,
      entities: [User, ModuleEntity, Permission, Invitation],
    }),
    AutentikigoModule,
    PermesonModule,
  ],
  controllers: [],
})
export class AppModule {}
