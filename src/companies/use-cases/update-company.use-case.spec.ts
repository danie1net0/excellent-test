import { fakerBr } from '@js-brasil/fakerbr';
import { fakerPT_BR as faker } from '@faker-js/faker';

import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { Company } from '../entities/company.entity';
import { CompanyDto } from '../dto/company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { UpdateCompanyUseCase } from './update-company.use-case';

describe('UpdateCompanyUseCase', (): void => {
  let useCase: UpdateCompanyUseCase;
  let repository: CompanyRepositoryContract;
  let companies: Company[];

  beforeEach((): void => {
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

    repository = {
      findById: jest.fn((id: number): Promise<Company | null> => {
        const company = companies.find((c) => c.id === id);
        return Promise.resolve(company);
      }),

      findByCnpj: jest.fn((cnpj: string): Promise<Company | null> => {
        const company = companies.find((c) => c.cnpj.toString() === cnpj);
        return Promise.resolve(company);
      }),

      save: jest.fn((company: Company): Promise<Company> => {
        company.updatedAt = new Date();
        return Promise.resolve(company);
      }),
    } as unknown as CompanyRepositoryContract;

    useCase = new UpdateCompanyUseCase(repository);
  });

  describe('execute', (): void => {
    test('deve atualizar empresa existente', async (): Promise<void> => {
      const input: UpdateCompanyDto = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: fakerBr.cnpj(),
      };

      const output: CompanyDto = await useCase.execute(1, input);

      expect(repository.findById).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(output).toBeInstanceOf(CompanyDto);
      expect(output).toEqual(
        expect.objectContaining({
          id: 1,
          email: input.email,
          corporateName: input.corporateName,
          cnpj: input.cnpj,
          createdAt: companies[0].createdAt,
          updatedAt: expect.any(Date),
        }),
      );
    });

    test('deve atualizar empresa com os mesmos dados', async (): Promise<void> => {
      const company: Company = companies[0];
      const input: UpdateCompanyDto = {
        email: company.email,
        corporateName: company.corporateName,
        cnpj: company.cnpj.toString(),
      };

      const output: CompanyDto = await useCase.execute(company.id, input);

      expect(repository.findById).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(output).toBeInstanceOf(CompanyDto);
      expect(output).toEqual(
        expect.objectContaining({
          id: 1,
          email: company.email,
          corporateName: company.corporateName,
          cnpj: company.cnpj.toString(),
          createdAt: company.createdAt,
          updatedAt: expect.any(Date),
        }),
      );
    });

    test('deve lançar erro se a empresa não existir', async (): Promise<void> => {
      const input: UpdateCompanyDto = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: fakerBr.cnpj(),
      };

      await expect(useCase.execute(3, input)).rejects.toThrow(
        'Company not found',
      );
      expect(repository.findById).toHaveBeenCalledWith(3);
      expect(repository.save).not.toHaveBeenCalled();
    });

    test('deve lançar erro se o repositório falhar ao salvar', async (): Promise<void> => {
      const error = new Error('Falha na conexão com o banco de dados');
      repository.save = jest.fn().mockRejectedValue(error);

      const input: UpdateCompanyDto = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: fakerBr.cnpj(),
      };

      await expect(useCase.execute(1, input)).rejects.toThrow(
        'Falha na conexão com o banco de dados',
      );
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalled();
    });

    test('deve se já existir empresa com o mesmo CNPJ', async (): Promise<void> => {
      const input: UpdateCompanyDto = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: companies[1].cnpj.toString(),
      };

      await expect(useCase.execute(1, input)).rejects.toThrow(
        'Company with this CNPJ already exists.',
      );
    });
  });
});
