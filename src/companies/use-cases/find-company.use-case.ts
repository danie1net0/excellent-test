import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { CompanyDto } from '../dto/company.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class FindCompanyUseCase {
  public constructor(private readonly repository: CompanyRepositoryContract) {}

  public async execute(id: number): Promise<CompanyDto> {
    const company: Company = await this.repository.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return CompanyDto.fromEntity(company);
  }
}
