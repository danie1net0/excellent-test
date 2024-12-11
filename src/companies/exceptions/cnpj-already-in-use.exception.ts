import { HttpException, HttpStatus } from '@nestjs/common';

export class CnpjAlreadyInUseException extends HttpException {
  constructor() {
    super('Company with this CNPJ already exists.', HttpStatus.BAD_REQUEST);
  }
}
