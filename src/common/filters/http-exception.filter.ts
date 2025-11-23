// src/common/filters/http-exception.filter.ts
// Global exception filter to return consistent error JSON

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const response = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };
    res.status(status).json({ success: false, message: response });
  }
}
