import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../common/types';

export enum SalesTransactionSortBy {
  NewestFirst = 'newest_first',
  OldestFirst = 'oldest_first',
  FirstNameAsc = 'first_name_asc',
  FirstNameDesc = 'first_name_desc',
  LastNameAsc = 'last_name_asc',
  LastNameDesc = 'last_name_desc',
}

export class GetSalesTransactionListQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  transactionCode?: string;

  @IsOptional()
  @IsString()
  custEmail?: string;

  @IsOptional()
  @IsString()
  custCode?: string;

  @IsOptional()
  @IsString()
  custName?: string;

  @IsOptional()
  @IsEnum(SalesTransactionSortBy)
  sortBy?: SalesTransactionSortBy;
}

@Exclude()
export class GetSalesTransactionItemDto {
  @Expose()
  transactionId!: string;

  @Expose()
  transactionCode!: string;

  @Expose()
  itemName!: string;

  @Expose()
  payment!: string;

  @Expose()
  source!: string;

  @Expose()
  amount!: number;

  @Expose()
  custName!: string;

  @Expose()
  custEmail!: string;

  @Expose()
  custCode!: string;
}

export class GetSalesTransactionListResDto {
  @Expose()
  @Type(() => GetSalesTransactionItemDto)
  items!: GetSalesTransactionItemDto[];

  @Expose()
  @Type(() => Number)
  total!: number;
}
