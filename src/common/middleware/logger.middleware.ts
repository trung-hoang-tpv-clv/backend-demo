import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request | any, response: Response, next: NextFunction): void {
    if (process.env.LOG_REQUEST) {
      const { ip, method, originalUrl } = request;
      const userAgent = request.get('user-agent') || '';
      const now = Date.now();
      response.on('finish', () => {
        const { statusCode } = response;
        const executeTime = Date.now() - now;
        console.info(`Total time taken : ${executeTime} milliseconds`);
        console.info(
          `Response information of request: ${method} ${originalUrl} ${statusCode} ${executeTime}ms - ${userAgent} ${ip}`,
        );
      });
    }
    next();
  }
}
