import { registerDecorator, ValidationOptions } from 'class-validator';

import { CnpjVo } from '../vo/cnpj.vo';

export const IsCnpj = (options?: ValidationOptions) => {
  return (object: object, property: string): void => {
    register(object, property, options);
  };
};

const register = (
  object: object,
  propertyName: string,
  options?: ValidationOptions,
): void => {
  registerDecorator({
    name: 'isCnpj',
    target: object.constructor,
    propertyName: propertyName,
    options: {
      ...options,
      message: options?.message ?? 'cnpj must be a valid cnpj',
    },
    validator: {
      validate: (value: string): boolean => validate(value),
    },
  });
};

const validate = (value: string): boolean => {
  try {
    CnpjVo.create(value);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return false;
  }
};
