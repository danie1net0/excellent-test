import { Module } from '@nestjs/common';

import { CompaniesController } from './companies.controller';
import { PrismaCompanyRepository } from './repositories/prisma-company.repository';
import { CompanyRepositoryContract } from './repositories/company-repository.contract';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateCompanyUseCase } from './use-cases/create-company.use-case';
import { UpdateCompanyUseCase } from './use-cases/update-company.use-case';
import { FindCompanyUseCase } from './use-cases/find-company.use-case';
import { ListCompaniesUseCase } from './use-cases/list-companies.use-case';

@Module({
  controllers: [CompaniesController],
  providers: [
    {
      provide: CompanyRepositoryContract,
      useClass: PrismaCompanyRepository,
    },
    PrismaService,
    CreateCompanyUseCase,
    UpdateCompanyUseCase,
    FindCompanyUseCase,
    ListCompaniesUseCase,
  ],
})
export class CompaniesModule {}
