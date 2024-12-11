import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyUseCase } from './use-cases/create-company.use-case';
import { UpdateCompanyUseCase } from './use-cases/update-company.use-case';
import { CompanyDto } from './dto/company.dto';
import { FindCompanyUseCase } from './use-cases/find-company.use-case';
import { ListCompaniesUseCase } from './use-cases/list-companies.use-case';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly createUseCase: CreateCompanyUseCase,
    private readonly updateUseCase: UpdateCompanyUseCase,
    private readonly findUseCase: FindCompanyUseCase,
    private readonly listUseCase: ListCompaniesUseCase,
  ) {}

  @Post()
  public async create(@Body() data: CreateCompanyDto): Promise<CompanyDto> {
    return this.createUseCase.execute(data);
  }

  @Get()
  public async findAll(): Promise<CompanyDto[]> {
    return this.listUseCase.execute();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<CompanyDto> {
    return this.findUseCase.execute(+id);
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    return this.updateUseCase.execute(+id, updateCompanyDto);
  }
}
