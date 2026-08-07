import { Logger } from '@nestjs/common';
import type { VaultItemRepositoryPort } from '../../domain/ports/vault-item.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import { EncryptedPayload } from '../../domain/value-objects/encrypted-payload.vo';
import type { CreateVaultItemInput } from '../dtos/create-vault-item.input';

export class CreateVaultItemUseCase {
  private readonly logger = new Logger(CreateVaultItemUseCase.name);

  constructor(
    private readonly vaultItemRepository: VaultItemRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(input: CreateVaultItemInput) {
    const payload = new EncryptedPayload({
      encryptedBlob: input.encryptedBlob,
      iv: input.iv,
      salt: input.salt,
      encryptionVersion: input.encryptionVersion,
    });

    const item = await this.vaultItemRepository.create({
      userId: input.userId,
      site: input.site,
      username: input.username,
      encryptedBlob: payload.encryptedBlob,
      iv: payload.iv,
      salt: payload.salt,
      encryptionVersion: payload.encryptionVersion,
    });

    await this.publishSafely('vault.secret_created.v1', input.userId, {
      vaultItemId: item.id,
      site: item.site,
      username: item.username,
    });

    return {
      vaultItemId: item.id,
      userId: item.userId,
      site: item.site,
      username: item.username,
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
