import { Injectable, NotFoundException } from '@nestjs/common';

import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { CompanyDto } from '../dto/company.dto';
import { Company } from '../entities/company.entity';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CnpjVo } from '../../shared/vo/cnpj.vo';
import { CnpjAlreadyInUseException } from '../exceptions/cnpj-already-in-use.exception';

@Injectable()
export class UpdateCompanyUseCase {
  public constructor(private readonly repository: CompanyRepositoryContract) {}

  public async execute(
    id: number,
    data: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    const company: Company = await this.repository.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    const isCnpjInUse: Company | null = await this.repository.findByCnpj(
      data.cnpj,
    );

    if (isCnpjInUse && isCnpjInUse.id !== id) {
      throw new CnpjAlreadyInUseException();
    }

    company.id = id;
    company.email = data.email;
    company.corporateName = data.corporateName;
    company.cnpj = CnpjVo.create(data.cnpj);
    company.updatedAt = new Date();

    const updated: Company = await this.repository.save(company);

    return CompanyDto.fromEntity(updated);
  }
}
