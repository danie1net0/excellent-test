import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { IsCnpj } from './is-cnpj.decorator';

describe('Decorator @IsCnpj', (): void => {
  class TestClass {
    @IsCnpj()
    cnpj: string;
  }

  test('deve aceitar um CNPJ válido', async (): Promise<void> => {
    const test: TestClass = plainToInstance(TestClass, {
      cnpj: '41015159000167',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBe(0);
  });

  test('deve aceitar um CNPJ válido formatado', async (): Promise<void> => {
    const test = plainToInstance(TestClass, {
      cnpj: '41.015.159/0001-67',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBe(0);
  });

  test('deve rejeitar um CNPJ com dígitos verificadores inválidos', async (): Promise<void> => {
    const test = plainToInstance(TestClass, {
      cnpj: '41015159000165',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'isCnpj',
      'cnpj must be a valid cnpj',
    );
  });

  test('deve rejeitar um CNPJ com tamanho inválido', async (): Promise<void> => {
    const test = plainToInstance(TestClass, {
      cnpj: '4101515900016',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'isCnpj',
      'cnpj must be a valid cnpj',
    );
  });

  test('deve rejeitar um CNPJ com dígitos repetidos', async (): Promise<void> => {
    const test = plainToInstance(TestClass, {
      cnpj: '11111111111111',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'isCnpj',
      'cnpj must be a valid cnpj',
    );
  });

  test('deve rejeitar um CNPJ com letras', async (): Promise<void> => {
    const test = plainToInstance(TestClass, {
      cnpj: '4101515900016A',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'isCnpj',
      'cnpj must be a valid cnpj',
    );
  });

  test('deve aceitar mensagem de erro personalizada', async (): Promise<void> => {
    class TestClassWithCustomMessage {
      @IsCnpj({ message: 'CNPJ inválido' })
      cnpj: string;
    }

    const test = plainToInstance(TestClassWithCustomMessage, {
      cnpj: '41015159000165',
    });

    const errors: ValidationError[] = await validate(test);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isCnpj', 'CNPJ inválido');
  });
});
