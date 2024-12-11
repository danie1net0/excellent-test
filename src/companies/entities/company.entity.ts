import { CnpjVo } from '../../shared/vo/cnpj.vo';

export class Company {
  public constructor(
    public email: string,
    public corporateName: string,
    public cnpj: CnpjVo,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  public static create(
    email: string,
    corporateName: string,
    cnpj: string,
  ): Company {
    return new Company(email, corporateName, CnpjVo.create(cnpj));
  }
}
