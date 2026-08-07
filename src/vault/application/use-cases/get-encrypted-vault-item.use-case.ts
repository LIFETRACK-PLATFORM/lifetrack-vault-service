import { Logger } from '@nestjs/common';
import type { VaultItemRepositoryPort } from '../../domain/ports/vault-item.repository.port';
import type { VaultAccessLogRepositoryPort } from '../../domain/ports/vault-access-log.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import {
  ForbiddenVaultAccessError,
  VaultItemNotFoundError,
} from '../../domain/exceptions/vault.errors';
import type { GetEncryptedVaultItemInput } from '../dtos/get-encrypted-vault-item.input';

export class GetEncryptedVaultItemUseCase {
  private readonly logger = new Logger(GetEncryptedVaultItemUseCase.name);

  constructor(
    private readonly vaultItemRepository: VaultItemRepositoryPort,
    private readonly vaultAccessLogRepository: VaultAccessLogRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(input: GetEncryptedVaultItemInput) {
    const item = await this.vaultItemRepository.findById(input.vaultItemId);
    if (!item) {
      throw new VaultItemNotFoundError(input.vaultItemId);
    }

    if (!item.belongsTo(input.userId)) {
      throw new ForbiddenVaultAccessError(input.vaultItemId);
    }

    await this.vaultAccessLogRepository.create({
      userId: input.userId,
      vaultItemId: item.id,
    });

    await this.publishSafely('vault.secret_accessed.v1', input.userId, {
      vaultItemId: item.id,
      site: item.site,
    });

    return {
      vaultItemId: item.id,
      site: item.site,
      username: item.username,
      encryptedBlob: item.encryptedBlob,
      iv: item.iv,
      salt: item.salt,
      encryptionVersion: item.encryptionVersion,
    };
  }

  private async publishSafely<TPayload>(
    eventType: string,
    actorId: string,
    payload: TPayload,
  ): Promise<void> {
    try {
      await this.eventPublisher.publish({ eventType, actorId, payload });
    } catch (err) {
      this.logger.error(
        `Fallo al publicar ${eventType}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }
}
