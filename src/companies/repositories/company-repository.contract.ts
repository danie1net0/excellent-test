import { Company } from '../entities/company.entity';

export abstract class CompanyRepositoryContract {
  public abstract create(company: Company): Promise<Company>;
  public abstract update(company: Company): Promise<Company>;
  public abstract save(company: Company): Promise<Company>;
  public abstract findById(id: number): Promise<Company | null>;
  public abstract findByCnpj(cnpj: string): Promise<Company | null>;
  public abstract findAll(): Promise<Company[]>;
}
