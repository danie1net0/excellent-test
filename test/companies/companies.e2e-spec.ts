import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import * as request from 'supertest';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { fakerBr } from '@js-brasil/fakerbr';

import { CompaniesModule } from '../../src/companies/companies.module';
import { CompanyRepositoryContract } from '../../src/companies/repositories/company-repository.contract';
import { PrismaService } from '../../src/shared/services/prisma.service';
import { PrismaCompanyRepository } from '../../src/companies/repositories/prisma-company.repository';
import { HttpExceptionFilter } from '../../src/shared/filters/http-exception.filter';

describe('Companies', (): void => {
  let app: INestApplication;
  let repository: CompanyRepositoryContract;

  beforeAll(async (): Promise<void> => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CompaniesModule],
      providers: [
        PrismaService,
        {
          provide: CompanyRepositoryContract,
          useFactory: (prisma: PrismaService) => {
            return new PrismaCompanyRepository(prisma);
          },
          inject: [PrismaService],
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = moduleRef.get<CompanyRepositoryContract>(
      CompanyRepositoryContract,
    );
  });

  describe('/POST companies', (): void => {
    test('deve criar empresa', async (): Promise<void> => {
      const input = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: fakerBr.cnpj(),
      };

      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(input)
        .expect(201);

      const company = (await repository.findAll()).shift();

      expect(response.body).toEqual({
        id: company.id,
        email: input.email,
        corporateName: input.corporateName,
        cnpj: input.cnpj,
        createdAt: company.createdAt.toISOString(),
        updatedAt: company.updatedAt.toISOString(),
      });
    });

    test('deve validar campos', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send({})
        .expect(400);

      expect(response.body.message).toEqual([
        'email must be shorter than or equal to 100 characters',
        'email should not be empty',
        'email must be an email',
        'corporateName must be shorter than or equal to 100 characters',
        'corporateName should not be empty',
        'corporateName must be a string',
        'cnpj must be a valid cnpj',
        'cnpj must be shorter than or equal to 14 characters',
        'cnpj should not be empty',
        'cnpj must be a string',
      ]);
    });
  });

  describe('/PUT companies', (): void => {
    test('deve atualizar empresa', async (): Promise<void> => {
      const input = {
        email: faker.internet.email(),
        corporateName: faker.company.name(),
        cnpj: fakerBr.cnpj(),
      };

      const company = (await repository.findAll()).shift();

      const response = await request(app.getHttpServer())
        .put(`/companies/${company.id}`)
        .send(input)
        .expect(200);

      expect(response.body).toEqual({
        id: company.id,
        email: input.email,
        corporateName: input.corporateName,
        cnpj: input.cnpj,
        createdAt: company.createdAt.toISOString(),
        updatedAt: expect.any(String),
      });
    });

    test('deve validar campos', async (): Promise<void> => {
      const company = (await repository.findAll()).shift();
      const response = await request(app.getHttpServer())
        .put(`/companies/${company.id}`)
        .send({})
        .expect(400);

      expect(response.body.message).toEqual([
        'email must be shorter than or equal to 100 characters',
        'email should not be empty',
        'email must be an email',
        'corporateName must be shorter than or equal to 100 characters',
        'corporateName should not be empty',
        'corporateName must be a string',
        'cnpj must be a valid cnpj',
        'cnpj must be shorter than or equal to 14 characters',
        'cnpj should not be empty',
        'cnpj must be a string',
      ]);
    });

    test('deve retornar 404 se empresa não existir', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
        .put('/companies/999')
        .send({
          email: faker.internet.email(),
          corporateName: faker.company.name(),
          cnpj: fakerBr.cnpj(),
        })
        .expect(404);

      expect(response.body.message).toEqual('Company not found.');
    });

    test('deve retornar 400 se o CNPJ já estiver em uso', async (): Promise<void> => {
      const company = (await repository.findAll()).shift();
      const anotherCompany = (await repository.findAll()).pop();
      const response = await request(app.getHttpServer())
        .put(`/companies/${company.id}`)
        .send({
          email: faker.internet.email(),
          corporateName: faker.company.name(),
          cnpj: anotherCompany.cnpj,
        })
        .expect(400);

      expect(response.body.message).toEqual(
        'Company with this CNPJ already exists.',
      );
    });
  });

  describe('/GET companies', (): void => {
    test('deve listar empresas', async (): Promise<void> => {
      const companies = await repository.findAll();

      const response = await request(app.getHttpServer())
        .get('/companies')
        .expect(200);

      const expected = companies.map((company) => ({
        id: company.id,
        email: company.email,
        corporateName: company.corporateName,
        cnpj: company.cnpj,
        createdAt: company.createdAt.toISOString(),
        updatedAt: company.updatedAt.toISOString(),
      }));

      expect(response.body).toEqual(expected);
    });
  });

  describe('/GET companies/:id', (): void => {
    test('deve retornar empresa', async (): Promise<void> => {
      const company = (await repository.findAll()).shift();

      const response = await request(app.getHttpServer())
        .get(`/companies/${company.id}`)
        .expect(200);

      expect(response.body).toEqual({
        id: company.id,
        email: company.email,
        corporateName: company.corporateName,
        cnpj: company.cnpj,
        createdAt: company.createdAt.toISOString(),
        updatedAt: company.updatedAt.toISOString(),
      });
    });

    test('deve retornar 404 se empresa não existir', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
        .get('/companies/999')
        .expect(404);

      expect(response.body.message).toEqual('Company not found.');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
