import { CompanyRepositoryContract } from '../repositories/company-repository.contract';
import { Company } from '../entities/company.entity';
import { CompanyDto } from '../dto/company.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CreateCompanyUseCase } from './create-company.use-case';

describe('CreateCompanyUseCase', (): void => {
  let useCase: CreateCompanyUseCase;
  let repository: CompanyRepositoryContract;

  beforeEach(() => {
    repository = {
      save: jest.fn((company: Company): Promise<CompanyDto> => {
        company.id = 1;
        company.createdAt = new Date();
        company.updatedAt = company.createdAt;

        return Promise.resolve(CompanyDto.fromEntity(company));
      }),
    } as unknown as CompanyRepositoryContract;

    useCase = new CreateCompanyUseCase(repository);
  });

  describe('execute', (): void => {
    test('deve criar empresa', async (): Promise<void> => {
      const input: CreateCompanyDto = {
        email: 'test@company.com',
        corporateName: 'Test Company Ltd',
        cnpj: '11222333000181',
      };

      const output: CompanyDto = await useCase.execute(input);

      expect(repository.save).toHaveBeenCalled();
      expect(output).toBeInstanceOf(CompanyDto);
      expect(output).toEqual(
        expect.objectContaining({
          id: 1,
          email: input.email,
          corporateName: input.corporateName,
          cnpj: input.cnpj,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    test('deve lançar erro se o repositório falhar', async (): Promise<void> => {
      const error = new Error('Falha na conexão com o banco de dados');
      repository.save = jest.fn().mockRejectedValue(error);

      const input: CreateCompanyDto = {
        email: 'test@company.com',
        corporateName: 'Test Company Ltd',
        cnpj: '11222333000181',
      };

      await expect(useCase.execute(input)).rejects.toThrow(
        'Falha na conexão com o banco de dados',
      );
    });
  });
});
