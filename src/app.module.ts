import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from './common/config';
import { dbConfig } from './common/constant';
import { OnApplicationBootstrap } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware';
import { AuthModule } from './modules/auth/auth.module';
import { SalesTransactionModule } from './modules/sales-transaction/sales-transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>(dbConfig);
        if (!config) {
          throw new Error('Database config missing or wrong ');
        }
        return config;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    SalesTransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  onApplicationBootstrap(): void {
    process.on('uncaughtException', (error) => {
      console.error('uncaughtException error: ', error);
    });
  }
}
