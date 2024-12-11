import { Company } from '../entities/company.entity';

export class CompanyDto {
  public constructor(
    public id: number,
    public corporateName: string,
    public email: string,
    public cnpj: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public static fromEntity(entity: Company): CompanyDto {
    return new CompanyDto(
      entity.id,
      entity.corporateName,
      entity.email,
      entity.cnpj.toString(),
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
