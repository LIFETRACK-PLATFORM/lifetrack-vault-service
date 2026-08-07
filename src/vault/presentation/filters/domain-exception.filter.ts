import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import {
  DomainError,
  ForbiddenVaultAccessError,
  InvalidEncryptedFormatError,
  VaultItemNotFoundError,
} from '../../domain/exceptions/vault.errors';

type DomainErrorConstructor = new (...args: unknown[]) => DomainError;

const ERROR_CODE_MAP = new Map<DomainErrorConstructor, GrpcStatus>([
  [InvalidEncryptedFormatError, GrpcStatus.INVALID_ARGUMENT],
  [VaultItemNotFoundError, GrpcStatus.NOT_FOUND],
  [ForbiddenVaultAccessError, GrpcStatus.PERMISSION_DENIED],
]);

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, _: ArgumentsHost): Observable<never> {
    const code =
      ERROR_CODE_MAP.get(exception.constructor as DomainErrorConstructor) ??
      GrpcStatus.INVALID_ARGUMENT;

    return throwError(
      () => new RpcException({ code, message: exception.message }),
    );
  }
}
