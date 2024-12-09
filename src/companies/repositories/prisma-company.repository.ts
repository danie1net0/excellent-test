import { Injectable, NotFoundException } from '@nestjs/common';

import { CompanyRepositoryContract } from './company-repository.contract';
import { Company } from '../entities/company.entity';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepositoryContract {
  public constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<Company[]> {
    return (await this.prisma.company.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })) as unknown as Company[];
  }

  public async findById(id: number): Promise<Company> {
    const company: Company | null = (await this.prisma.company.findUnique({
      where: { id },
    })) as unknown as Company;

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  public async findByCnpj(cnpj: string): Promise<Company | null> {
    return (await this.prisma.company.findUnique({
      where: { cnpj },
    })) as unknown as Company;
  }

  public async create(company: Company): Promise<Company> {
    const entity: Company = (await this.prisma.company.create({
      data: {
        email: company.email,
        corporateName: company.corporateName,
        cnpj: company.cnpj.toString(),
      },
    })) as unknown as Company;

    company.id = entity.id;
    company.createdAt = entity.createdAt;
    company.updatedAt = entity.updatedAt;

    return company;
  }

  public async update(company: Company): Promise<Company> {
    return (await this.prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        email: company.email,
        corporateName: company.corporateName,
        cnpj: company.cnpj.toString(),
      },
    })) as unknown as Company;
  }

  public async save(company: Company): Promise<Company> {
    if (company.id) {
      return await this.update(company);
    }

    return await this.create(company);
  }
}
