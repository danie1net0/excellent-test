import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { fakerBr } from '@js-brasil/fakerbr';

import { CompaniesController } from './companies.controller';
import { CreateCompanyUseCase } from './use-cases/create-company.use-case';
import { UpdateCompanyUseCase } from './use-cases/update-company.use-case';
import { FindCompanyUseCase } from './use-cases/find-company.use-case';
import { ListCompaniesUseCase } from './use-cases/list-companies.use-case';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyDto } from './dto/company.dto';

describe('CompaniesController', (): void => {
  let controller: CompaniesController;
  let createUseCase: CreateCompanyUseCase;
  let updateUseCase: UpdateCompanyUseCase;
  let findUseCase: FindCompanyUseCase;
  let listUseCase: ListCompaniesUseCase;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CreateCompanyUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateCompanyUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindCompanyUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListCompaniesUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    createUseCase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
    updateUseCase = module.get<UpdateCompanyUseCase>(UpdateCompanyUseCase);
    findUseCase = module.get<FindCompanyUseCase>(FindCompanyUseCase);
    listUseCase = module.get<ListCompaniesUseCase>(ListCompaniesUseCase);
  });

  describe('create', (): void => {
    it('deve criar uma nova empresa', async (): Promise<void> => {
      const createCompanyDto: CreateCompanyDto = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: fakerBr.cnpj(),
      };

      const expectedResult = new CompanyDto(
        1,
        createCompanyDto.corporateName,
        createCompanyDto.email,
        createCompanyDto.cnpj,
        new Date(),
        new Date(),
      );

      jest.spyOn(createUseCase, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.create(createCompanyDto);

      expect(createUseCase.execute).toHaveBeenCalledWith(createCompanyDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', (): void => {
    it('deve retornar uma lista de empresas', async (): Promise<void> => {
      const companies = [
        new CompanyDto(
          1,
          faker.company.name(),
          faker.internet.email(),
          fakerBr.cnpj(),
          new Date(),
          new Date(),
        ),
        new CompanyDto(
          2,
          faker.company.name(),
          faker.internet.email(),
          fakerBr.cnpj(),
          new Date(),
          new Date(),
        ),
      ];

      jest.spyOn(listUseCase, 'execute').mockResolvedValue(companies);

      const result = await controller.findAll();

      expect(listUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(companies);
    });

    it('deve lançar erro se o caso de uso falhar', async (): Promise<void> => {
      const error = new Error('Database connection error');
      jest.spyOn(listUseCase, 'execute').mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(listUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', (): void => {
    it('deve retornar uma única empresa', async (): Promise<void> => {
      const expectedResult = new CompanyDto(
        1,
        faker.company.name(),
        faker.internet.email(),
        fakerBr.cnpj(),
        new Date(),
        new Date(),
      );

      jest.spyOn(findUseCase, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(findUseCase.execute).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });

    it('deve lançar erro quando a empresa não for encontrada', async (): Promise<void> => {
      const error = new NotFoundException('Company not found');
      jest.spyOn(findUseCase, 'execute').mockRejectedValue(error);

      await expect(controller.findOne('999')).rejects.toThrow(error);
      expect(findUseCase.execute).toHaveBeenCalledWith(999);
    });
  });

  describe('update', (): void => {
    it('deve atualizar uma empresa existente', async (): Promise<void> => {
      const updateCompanyDto: UpdateCompanyDto = {
        email: 'updated@company.com',
        corporateName: 'Updated Company Ltd',
        cnpj: '11222333000181',
      };

      const expectedResult = new CompanyDto(
        1,
        updateCompanyDto.corporateName,
        updateCompanyDto.email,
        updateCompanyDto.cnpj,
        new Date(),
        new Date(),
      );

      jest.spyOn(updateUseCase, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateCompanyDto);

      expect(updateUseCase.execute).toHaveBeenCalledWith(1, updateCompanyDto);
      expect(result).toBe(expectedResult);
    });
  });
});
