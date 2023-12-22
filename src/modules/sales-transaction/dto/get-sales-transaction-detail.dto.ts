import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetSalesTransactionDetailDto {
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
