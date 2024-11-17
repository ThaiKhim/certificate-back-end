import {
  BadRequestException,
  Optional,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { snakeCase } from 'lodash';

export class MainValidationPipe extends ValidationPipe {
  constructor(@Optional() options: ValidationPipeOptions = {}) {
    super({
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      ...options,
    });
  }

  exceptionFactory: any = (errors: ValidationError[]) => {
    const transformedErrors = errors
      .map((error) => this.mapChildren(error))
      .reduce(
        (previousErrors, currentError) => [...previousErrors, ...currentError],
        [],
      )
      .filter((error) => !!Object.keys(error.constraints).length)
      .map((error) => {
        const [key, message] = Object.entries(error.constraints)[0];
        const field = error.property;
        const code = snakeCase(key).toLowerCase();

        return { field, code, message };
      });

    throw new BadRequestException(transformedErrors);
  };

  private mapChildren(error: ValidationError): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }
    const validationErrors = [];
    for (const item of error.children) {
      if (item.children && item.children.length) {
        validationErrors.push(...this.mapChildren(item));
      }
      validationErrors.push(MainValidationPipe.prependConstraints(item));
    }
    return validationErrors;
  }

  private static prependConstraints(error: ValidationError): ValidationError {
    const constraints = {};
    for (const key in error.constraints) {
      constraints[key] = error.constraints[key];
    }
    return { ...error, constraints };
  }
}
