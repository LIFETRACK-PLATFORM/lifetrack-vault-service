import type { VaultItemRepositoryPort } from '../../domain/ports/vault-item.repository.port';
import {
  ForbiddenVaultAccessError,
  VaultItemNotFoundError,
} from '../../domain/exceptions/vault.errors';
import type { DeleteVaultItemInput } from '../dtos/delete-vault-item.input';

export class DeleteVaultItemUseCase {
  constructor(private readonly vaultItemRepository: VaultItemRepositoryPort) {}

  async execute(input: DeleteVaultItemInput) {
    const existing = await this.vaultItemRepository.findById(input.vaultItemId);
    if (!existing) {
      throw new VaultItemNotFoundError(input.vaultItemId);
    }

    if (!existing.belongsTo(input.userId)) {
      throw new ForbiddenVaultAccessError(input.vaultItemId);
    }

    await this.vaultItemRepository.delete(input.vaultItemId);

    return { deleted: true };
  }
}
