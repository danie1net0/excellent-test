import { Injectable } from '@nestjs/common';

import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { CompanyDto } from '../dto/company.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class ListCompaniesUseCase {
  public constructor(private readonly repository: CompanyRepositoryContract) {}

  public async execute(): Promise<CompanyDto[]> {
    const companies: Company[] = await this.repository.findAll();

    return companies.map(
      (company: Company): CompanyDto => CompanyDto.fromEntity(company),
    );
  }
}
