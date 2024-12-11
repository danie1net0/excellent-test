import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCnpj } from '../../shared/decorators/is-cnpj.decorator';

export class CreateCompanyDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  corporateName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  @IsCnpj()
  cnpj: string;
}
