import type { VaultItemRepositoryPort } from '../../domain/ports/vault-item.repository.port';
import { EncryptedPayload } from '../../domain/value-objects/encrypted-payload.vo';
import {
  ForbiddenVaultAccessError,
  VaultItemNotFoundError,
} from '../../domain/exceptions/vault.errors';
import type { UpdateVaultItemInput } from '../dtos/update-vault-item.input';

export class UpdateVaultItemUseCase {
  constructor(private readonly vaultItemRepository: VaultItemRepositoryPort) {}

  async execute(input: UpdateVaultItemInput) {
    const existing = await this.vaultItemRepository.findById(input.vaultItemId);
    if (!existing) {
      throw new VaultItemNotFoundError(input.vaultItemId);
    }

    if (!existing.belongsTo(input.userId)) {
      throw new ForbiddenVaultAccessError(input.vaultItemId);
    }

    const payload = new EncryptedPayload({
      encryptedBlob: input.encryptedBlob,
      iv: input.iv,
      salt: input.salt,
      encryptionVersion: input.encryptionVersion,
    });

    const item = await this.vaultItemRepository.update(input.vaultItemId, {
      site: input.site,
      username: input.username,
      category: input.category?.trim() || existing.category,
      encryptedBlob: payload.encryptedBlob,
      iv: payload.iv,
      salt: payload.salt,
      encryptionVersion: payload.encryptionVersion,
    });

    return {
      vaultItemId: item.id,
      userId: item.userId,
      site: item.site,
      username: item.username,
      category: item.category,
      iv: item.iv,
      salt: item.salt,
      encryptionVersion: item.encryptionVersion,
    };
  }
}
