import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards';
import {
  GetSalesTransactionDetailDto,
  GetSalesTransactionListQueryDto,
  GetSalesTransactionListResDto,
} from './dto';
import { SalesTransactionService } from './sales-transaction.service';

@Controller('sales-transactions')
@ApiTags('SalesTransactions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class SalesTransactionController {
  constructor(private salesTransactionService: SalesTransactionService) {}

  @Get()
  @ApiResponse({
    type: GetSalesTransactionListResDto,
    description: 'This api to get transaction list',
  })
  async getTransactionList(
    @Query() query: GetSalesTransactionListQueryDto,
  ): Promise<GetSalesTransactionListResDto> {
    return this.salesTransactionService.getTransactionList(query);
  }

  @Get(':transactionId')
  @ApiResponse({
    type: GetSalesTransactionDetailDto,
    description: 'This api to get sales transaction detail',
  })
  async getTransactionDetailById(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ): Promise<GetSalesTransactionDetailDto> {
    return this.salesTransactionService.getTransactionDetailById(transactionId);
  }
}
