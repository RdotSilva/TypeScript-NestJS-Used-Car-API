import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // This will automatically create the repository for us
  providers: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule {}
