import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pageIndex?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;

  get offset(): number | undefined {
    if (!this.pageIndex || !this.pageSize) {
      return;
    }
    return (this.pageIndex - 1) * this.pageSize;
  }

  get limit(): number | undefined {
    if (!this.pageSize) {
      return;
    }
    return this.pageSize;
  }
}
