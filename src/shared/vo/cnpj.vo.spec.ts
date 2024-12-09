import { CnpjVo } from './cnpj.vo';

describe('CNPJ Value Object', (): void => {
  describe('create', (): void => {
    test('deve criar uma instância válida de CNPJ', (): void => {
      const validCNPJ = '11.222.333/0001-81';
      const cnpj = CnpjVo.create(validCNPJ);
      expect(cnpj).toBeInstanceOf(CnpjVo);
    });

    test('deve aceitar CNPJ sem formatação', (): void => {
      const unformattedCNPJ = '11222333000181';
      const cnpj = CnpjVo.create(unformattedCNPJ);
      expect(cnpj).toBeInstanceOf(CnpjVo);
    });

    test('deve lançar erro para CNPJ vazio', (): void => {
      expect(() => CnpjVo.create('')).toThrow('CNPJ cannot be empty');
    });

    test('deve lançar erro para formato de CNPJ inválido', (): void => {
      const invalidCNPJ = '11.222.333/0001-00';
      expect(() => CnpjVo.create(invalidCNPJ)).toThrow('Invalid CNPJ');
    });

    test('deve lançar erro para CNPJ com todos os dígitos iguais', (): void => {
      const invalidCNPJ = '11.111.111/1111-11';
      expect(() => CnpjVo.create(invalidCNPJ)).toThrow('Invalid CNPJ');
    });

    test('deve lançar erro para CNPJ com tamanho incorreto', (): void => {
      const invalidCNPJ = '11.222.333/0001';
      expect(() => CnpjVo.create(invalidCNPJ)).toThrow('Invalid CNPJ');
    });
  });

  describe('toString', (): void => {
    test('deve retornar string de CNPJ formatada', (): void => {
      const cnpj: CnpjVo = CnpjVo.create('11.222.333/0001-81');
      expect(cnpj.toString()).toBe('11222333000181');
    });
  });
});
