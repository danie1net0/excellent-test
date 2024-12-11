import { Test, TestingModule } from '@nestjs/testing';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { fakerBr } from '@js-brasil/fakerbr';

import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { Company } from '../entities/company.entity';
import { CompanyDto } from '../dto/company.dto';
import { ListCompaniesUseCase } from './list-companies.use-case';

describe('ListCompaniesUseCase', (): void => {
  let useCase: ListCompaniesUseCase;
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
        ListCompaniesUseCase,
        {
          provide: CompanyRepositoryContract,
          useValue: {
            findAll: jest.fn().mockResolvedValue(companies),
          },
        },
      ],
    }).compile();

    useCase = module.get<ListCompaniesUseCase>(ListCompaniesUseCase);
    repository = module.get<CompanyRepositoryContract>(
      CompanyRepositoryContract,
    );
  });

  describe('execute', (): void => {
    it('deve retornar uma lista de empresas', async (): Promise<void> => {
      const result = await useCase.execute();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(companies.length);
      expect(result[0]).toBeInstanceOf(CompanyDto);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: companies[0].id,
          email: companies[0].email,
          corporateName: companies[0].corporateName,
          cnpj: companies[0].cnpj.toString(),
          createdAt: companies[0].createdAt,
          updatedAt: companies[0].updatedAt,
        }),
      );
    });

    it('deve retornar uma lista vazia quando não houver empresas', async (): Promise<void> => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      const result = await useCase.execute();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(0);
    });

    it('deve lançar erro se o repositório falhar', async (): Promise<void> => {
      const error = new Error('Database connection error');
      jest.spyOn(repository, 'findAll').mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(error);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });
});
