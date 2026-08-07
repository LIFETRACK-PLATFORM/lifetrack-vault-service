import { GetEncryptedVaultItemUseCase } from './get-encrypted-vault-item.use-case';
import { VaultItemEntity } from '../../domain/entities/vault-item.entity';
import { ForbiddenVaultAccessError } from '../../domain/exceptions/vault.errors';
import type { VaultItemRepositoryPort } from '../../domain/ports/vault-item.repository.port';
import type { VaultAccessLogRepositoryPort } from '../../domain/ports/vault-access-log.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';

const validIv = Buffer.alloc(12, 1).toString('base64');
const validSalt = Buffer.alloc(16, 2).toString('base64');
const validBlob = Buffer.alloc(32, 3).toString('base64');

describe('GetEncryptedVaultItemUseCase', () => {
  it('rechaza acceso a item de otro usuario', async () => {
    const foreignItem = new VaultItemEntity(
      {
        userId: 'owner-user',
        site: 'github.com',
        username: 'owner',
        category: 'Personal',
        encryptedBlob: validBlob,
        iv: validIv,
        salt: validSalt,
        encryptionVersion: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'vault-item-foreign',
    );

    const vaultItemRepository: Pick<VaultItemRepositoryPort, 'findById'> = {
      findById: jest.fn().mockResolvedValue(foreignItem),
    };
    const vaultAccessLogRepository: Pick<
      VaultAccessLogRepositoryPort,
      'create'
    > = {
      create: jest.fn(),
    };
    const eventPublisher: Pick<EventPublisherPort, 'publish'> = {
      publish: jest.fn(),
    };

    const useCase = new GetEncryptedVaultItemUseCase(
      vaultItemRepository as VaultItemRepositoryPort,
      vaultAccessLogRepository,
      eventPublisher,
    );

    await expect(
      useCase.execute({
        userId: 'attacker-user',
        vaultItemId: 'vault-item-foreign',
      }),
    ).rejects.toBeInstanceOf(ForbiddenVaultAccessError);

    expect(vaultAccessLogRepository.create).not.toHaveBeenCalled();
    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });

  it('devuelve el blob cifrado y registra acceso para el propietario', async () => {
    const ownItem = new VaultItemEntity(
      {
        userId: 'user-1',
        site: 'github.com',
        username: 'dev',
        category: 'Personal',
        encryptedBlob: validBlob,
        iv: validIv,
        salt: validSalt,
        encryptionVersion: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'vault-item-1',
    );

    const vaultItemRepository: Pick<VaultItemRepositoryPort, 'findById'> = {
      findById: jest.fn().mockResolvedValue(ownItem),
    };
    const vaultAccessLogRepository: Pick<
      VaultAccessLogRepositoryPort,
      'create'
    > = {
      create: jest.fn().mockResolvedValue({}),
    };
    const eventPublisher: Pick<EventPublisherPort, 'publish'> = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new GetEncryptedVaultItemUseCase(
      vaultItemRepository as VaultItemRepositoryPort,
      vaultAccessLogRepository,
      eventPublisher,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      vaultItemId: 'vault-item-1',
    });

    expect(result.encryptedBlob).toBe(validBlob);
    expect(vaultAccessLogRepository.create).toHaveBeenCalledWith({
      userId: 'user-1',
      vaultItemId: 'vault-item-1',
    });
    expect(eventPublisher.publish).toHaveBeenCalledWith({
      eventType: 'vault.secret_accessed.v1',
      actorId: 'user-1',
      payload: { vaultItemId: 'vault-item-1', site: 'github.com' },
    });
  });
});
