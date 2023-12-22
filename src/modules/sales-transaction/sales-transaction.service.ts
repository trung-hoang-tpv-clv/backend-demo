import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetSalesTransactionDetailDto,
  GetSalesTransactionItemDto,
  GetSalesTransactionListQueryDto,
  GetSalesTransactionListResDto,
  SalesTransactionSortBy,
} from './dto';
import { SalesTransaction, User } from '../../domain/entities';

@Injectable()
export class SalesTransactionService {
  constructor(
    @InjectRepository(SalesTransaction)
    private salesTransactionRepository: Repository<SalesTransaction>,
    private dataSource: DataSource,
  ) {}

  async getTransactionList(
    query: GetSalesTransactionListQueryDto,
  ): Promise<GetSalesTransactionListResDto> {
    const {
      transactionCode,
      custCode,
      custEmail,
      custName,
      limit,
      offset,
      sortBy,
    } = query;

    const queryBuilder = await this.dataSource
      .createQueryBuilder<GetSalesTransactionItemDto>(
        SalesTransaction,
        'salesTransaction',
      )
      .leftJoin(User, 'user', 'user.userId = salesTransaction.userId')
      .select([
        'salesTransaction.transactionId as "transactionId"',
        'salesTransaction.transactionCode as "transactionCode"',
        'salesTransaction.itemName as "itemName"',
        'salesTransaction.payment as "payment"',
        'salesTransaction.source as "source"',
        'salesTransaction.amount as "amount"',
        'user.code as "custCode"',
        `concat(user.firstName, ' ', user.lastName) as "custName"`,
        'user.email as "custEmail"',
      ]);

    if (transactionCode) {
      queryBuilder.andWhere(
        'salesTransaction.transactionCode = :transactionCode',
        {
          transactionCode,
        },
      );
    }

    if (custCode) {
      queryBuilder.andWhere('user.code = :custCode', {
        custCode,
      });
    }

    if (custEmail) {
      queryBuilder.andWhere('user.email = :custEmail', {
        custEmail: `${custEmail}`,
      });
    }

    if (custName) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName LIKE :firstName', {
            firstName: `%${custName}%`,
          });
          qb.orWhere('user.lastName LIKE :lastName', {
            lastName: `%${custName}%`,
          });
        }),
      );
    }

    switch (sortBy) {
      case SalesTransactionSortBy.FirstNameAsc:
        queryBuilder.orderBy('user.firstName', 'ASC');
        break;
      case SalesTransactionSortBy.FirstNameDesc:
        queryBuilder.orderBy('user.firstName', 'DESC');
        break;
      case SalesTransactionSortBy.LastNameAsc:
        queryBuilder.orderBy('user.lastName', 'ASC');
        break;
      case SalesTransactionSortBy.LastNameDesc:
        queryBuilder.orderBy('user.lastName', 'DESC');
        break;
      case SalesTransactionSortBy.OldestFirst:
        queryBuilder.orderBy('salesTransaction.createdAt', 'ASC');
        break;
      default:
        queryBuilder.orderBy('salesTransaction.createdAt', 'DESC');
        break;
    }

    if (sortBy) {
      queryBuilder.orderBy(
        'salesTransaction.createdAt',
        sortBy === SalesTransactionSortBy.OldestFirst ? 'ASC' : 'DESC',
      );
    }

    const [items, total] = await Promise.all([
      queryBuilder.limit(limit).offset(offset).getRawMany(),
      queryBuilder.getCount(),
    ]);

    return plainToInstance(GetSalesTransactionListResDto, {
      total,
      items,
    });
  }

  async getTransactionDetailById(
    transactionId: string,
  ): Promise<GetSalesTransactionDetailDto> {
    const salesTransaction = await this.salesTransactionRepository.findOne({
      where: {
        transactionId,
      },
    });

    if (!salesTransaction) {
      throw new NotFoundException('Transaction not found');
    }
    return plainToInstance(GetSalesTransactionDetailDto, salesTransaction);
  }
}
