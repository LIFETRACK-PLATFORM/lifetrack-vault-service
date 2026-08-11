import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
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

    // No envolver en `new RpcException(...)`: el transporte gRPC de NestJS
    // reenvía el error de esta observable tal cual al callback de grpc-js,
    // que solo respeta `error.code` si es una propiedad directa del objeto
    // (ver server-call.js#serverErrorToStatus). Una instancia de RpcException
    // no expone `code` como propiedad propia (solo vía getError()), así que
    // el status real en el wire caía siempre a UNKNOWN.
    return throwError(() => ({ code, message: exception.message }));
  }
}
