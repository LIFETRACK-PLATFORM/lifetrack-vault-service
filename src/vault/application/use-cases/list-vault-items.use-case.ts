import type { VaultItemRepositoryPort } from '../../domain/ports/vault-item.repository.port';
import type { ListVaultItemsInput } from '../dtos/list-vault-items.input';

export class ListVaultItemsUseCase {
  constructor(private readonly vaultItemRepository: VaultItemRepositoryPort) {}

  async execute(input: ListVaultItemsInput) {
    const items = await this.vaultItemRepository.listByUserId(input.userId);

    return {
      items: items.map((item) => ({
        vaultItemId: item.id,
        site: item.site,
        username: item.username,
        encryptionVersion: item.encryptionVersion,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };
  }
}
