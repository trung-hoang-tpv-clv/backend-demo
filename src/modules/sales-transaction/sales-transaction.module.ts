import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SalesTransactionController } from './sales-transaction.controller';
import { SalesTransactionService } from './sales-transaction.service';
import { SalesTransaction } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SalesTransaction])],
  controllers: [SalesTransactionController],
  providers: [SalesTransactionService, JwtService],
})
export class SalesTransactionModule {}
