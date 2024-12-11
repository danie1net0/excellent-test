import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { fakerBr } from '@js-brasil/fakerbr';

import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { Company } from '../entities/company.entity';
import { CompanyDto } from '../dto/company.dto';
import { FindCompanyUseCase } from './find-company.use-case';

describe('FindCompanyUseCase', (): void => {
  let useCase: FindCompanyUseCase;
  let repository: CompanyRepositoryContract;
  let companies: Company[];

  beforeEach(async (): Promise<void> => {
    companies = [
      new Company(
        faker.internet.email(),
        faker.company.name(),
        fakerBr.cnpj(),
        1,
        new Date(),
        new Date(),
      ),
      new Company(
        faker.internet.email(),
        faker.company.name(),
        fakerBr.cnpj(),
        2,
        new Date(),
        new Date(),
      ),
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCompanyUseCase,
        {
          provide: CompanyRepositoryContract,
          useValue: {
            findById: jest.fn((id: number): Promise<Company | null> => {
              const company = companies.find((c) => c.id === id);
              return Promise.resolve(company || null);
            }),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindCompanyUseCase>(FindCompanyUseCase);
    repository = module.get<CompanyRepositoryContract>(
      CompanyRepositoryContract,
    );
  });

  describe('execute', (): void => {
    it('deve retornar uma empresa quando encontrada', async (): Promise<void> => {
      const result = await useCase.execute(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(CompanyDto);
      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          email: companies[0].email,
          corporateName: companies[0].corporateName,
          cnpj: companies[0].cnpj.toString(),
          createdAt: companies[0].createdAt,
          updatedAt: companies[0].updatedAt,
        }),
      );
    });

    it('deve lançar NotFoundException quando a empresa não for encontrada', async (): Promise<void> => {
      await expect(useCase.execute(999)).rejects.toThrow(
        new NotFoundException('Company not found.'),
      );
      expect(repository.findById).toHaveBeenCalledWith(999);
    });

    it('deve lançar erro se o repositório falhar', async (): Promise<void> => {
      const error = new Error('Database connection error');
      jest.spyOn(repository, 'findById').mockRejectedValue(error);

      await expect(useCase.execute(1)).rejects.toThrow(error);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });
  });
});
