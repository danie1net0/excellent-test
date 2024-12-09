export class CnpjVo {
  private readonly value: string;

  private constructor(value: string) {
    this.value = this.format(value);
  }

  public static create(value: string): CnpjVo {
    if (!value) {
      throw new Error('CNPJ cannot be empty');
    }

    const cnpj = new CnpjVo(value);

    if (!cnpj.isValid()) {
      throw new Error('Invalid CNPJ.');
    }

    return cnpj;
  }

  public toString(): string {
    return this.value;
  }

  private format(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  private isValid(): boolean {
    const cleanValue: string = this.value;

    if (cleanValue.length !== 14) {
      return false;
    }

    if (/^(\d)\1+$/.test(cleanValue)) {
      return false;
    }

    let sum: number = 0;
    let weight: number = 5;

    for (let i: number = 0; i < 12; i++) {
      sum += parseInt(cleanValue.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    let digit: number = 11 - (sum % 11);
    const firstDigit: number = digit >= 10 ? 0 : digit;

    if (parseInt(cleanValue.charAt(12)) !== firstDigit) {
      return false;
    }

    sum = 0;
    weight = 6;

    for (let i: number = 0; i < 13; i++) {
      sum += parseInt(cleanValue.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    digit = 11 - (sum % 11);
    const secondDigit: number = digit >= 10 ? 0 : digit;

    return parseInt(cleanValue.charAt(13)) === secondDigit;
  }
}
