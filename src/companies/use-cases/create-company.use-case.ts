import { Injectable } from '@nestjs/common';

import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { CompanyDto } from '../dto/company.dto';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';

@Injectable()
export class CreateCompanyUseCase {
  public constructor(private readonly repository: CompanyRepositoryContract) {}

  public async execute(data: CreateCompanyDto): Promise<CompanyDto> {
    const company: Company = Company.create(
      data.email,
      data.corporateName,
      data.cnpj,
    );

    const created: Company = await this.repository.save(company);

    return CompanyDto.fromEntity(created);
  }
}
