import { CreateVaultItemUseCase } from './create-vault-item.use-case';
import { VaultItemEntity } from '../../domain/entities/vault-item.entity';
import { InvalidEncryptedFormatError } from '../../domain/exceptions/vault.errors';
import type {
  CreateVaultItemData,
  VaultItemRepositoryPort,
} from '../../domain/ports/vault-item.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';

const validIv = Buffer.alloc(12, 1).toString('base64');
const validSalt = Buffer.alloc(16, 2).toString('base64');
const validBlob = Buffer.alloc(32, 3).toString('base64');

describe('CreateVaultItemUseCase', () => {
  it('crea un item cifrado y publica vault.secret_created.v1', async () => {
    const vaultItemRepository: Pick<VaultItemRepositoryPort, 'create'> = {
      create: jest.fn().mockImplementation((data: CreateVaultItemData) =>
        Promise.resolve(
          new VaultItemEntity(
            {
              userId: data.userId,
              site: data.site,
              username: data.username,
              encryptedBlob: data.encryptedBlob,
              iv: data.iv,
              salt: data.salt,
              encryptionVersion: data.encryptionVersion,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            'vault-item-1',
          ),
        ),
      ),
    };
    const eventPublisher: Pick<EventPublisherPort, 'publish'> = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new CreateVaultItemUseCase(
      vaultItemRepository as VaultItemRepositoryPort,
      eventPublisher,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      site: 'github.com',
      username: 'dev',
      encryptedBlob: validBlob,
      iv: validIv,
      salt: validSalt,
      encryptionVersion: 'v1',
    });

    expect(result.vaultItemId).toBe('vault-item-1');
    expect(result.site).toBe('github.com');
    expect(eventPublisher.publish).toHaveBeenCalledWith({
      eventType: 'vault.secret_created.v1',
      actorId: 'user-1',
      payload: {
        vaultItemId: 'vault-item-1',
        site: 'github.com',
        username: 'dev',
      },
    });
  });

  it('rechaza payload con formato inválido', async () => {
    const useCase = new CreateVaultItemUseCase(
      {} as VaultItemRepositoryPort,
      {} as EventPublisherPort,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        site: 'github.com',
        username: 'dev',
        encryptedBlob: 'texto-plano',
        iv: validIv,
        salt: validSalt,
        encryptionVersion: 'v1',
      }),
    ).rejects.toBeInstanceOf(InvalidEncryptedFormatError);
  });
});
