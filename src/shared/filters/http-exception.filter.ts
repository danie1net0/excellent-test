import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response: Response = context.getResponse<Response>();
    const request: any = context.getRequest();
    const status: number = exception.getStatus();

    if (exception instanceof BadRequestException) {
      response.status(status).json(exception.getResponse());
      return;
    }

    const errorResponse = {
      statusCode: status,
      message: exception.message,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} ${exception.message}`,
    );

    response.status(status).json(errorResponse);
  }
}
