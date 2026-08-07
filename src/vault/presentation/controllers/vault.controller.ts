import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type { Metadata } from '@grpc/grpc-js';
import { GetOrCreateVaultSaltUseCase } from '../../application/use-cases/get-or-create-vault-salt.use-case';
import { CreateVaultItemUseCase } from '../../application/use-cases/create-vault-item.use-case';
import { ListVaultItemsUseCase } from '../../application/use-cases/list-vault-items.use-case';
import { GetEncryptedVaultItemUseCase } from '../../application/use-cases/get-encrypted-vault-item.use-case';
import { UpdateVaultItemUseCase } from '../../application/use-cases/update-vault-item.use-case';
import { DeleteVaultItemUseCase } from '../../application/use-cases/delete-vault-item.use-case';
import { CreateVaultItemDto } from '../dtos/create-vault-item.dto';
import { GetEncryptedVaultItemDto } from '../dtos/get-encrypted-vault-item.dto';
import { UpdateVaultItemDto } from '../dtos/update-vault-item.dto';
import { DeleteVaultItemDto } from '../dtos/delete-vault-item.dto';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { getAuthenticatedUserId } from '../auth/grpc-auth.context';

@Controller()
@UseFilters(DomainExceptionFilter)
export class VaultController {
  constructor(
    private readonly getOrCreateVaultSaltUseCase: GetOrCreateVaultSaltUseCase,
    private readonly createVaultItemUseCase: CreateVaultItemUseCase,
    private readonly listVaultItemsUseCase: ListVaultItemsUseCase,
    private readonly getEncryptedVaultItemUseCase: GetEncryptedVaultItemUseCase,
    private readonly updateVaultItemUseCase: UpdateVaultItemUseCase,
    private readonly deleteVaultItemUseCase: DeleteVaultItemUseCase,
  ) {}

  @GrpcMethod('VaultService', 'GetOrCreateVaultSalt')
  getOrCreateVaultSalt(_data: Record<string, never>, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.getOrCreateVaultSaltUseCase.execute({ userId });
  }

  @GrpcMethod('VaultService', 'CreateVaultItem')
  createVaultItem(data: CreateVaultItemDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.createVaultItemUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('VaultService', 'ListVaultItems')
  listVaultItems(_data: Record<string, never>, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.listVaultItemsUseCase.execute({ userId });
  }

  @GrpcMethod('VaultService', 'GetEncryptedVaultItem')
  getEncryptedVaultItem(data: GetEncryptedVaultItemDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.getEncryptedVaultItemUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('VaultService', 'UpdateVaultItem')
  updateVaultItem(data: UpdateVaultItemDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.updateVaultItemUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('VaultService', 'DeleteVaultItem')
  deleteVaultItem(data: DeleteVaultItemDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.deleteVaultItemUseCase.execute({ userId, ...data });
  }
}
