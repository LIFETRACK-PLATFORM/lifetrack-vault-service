import { GetOrCreateVaultSaltUseCase } from './get-or-create-vault-salt.use-case';
import type { VaultSaltRepositoryPort } from '../../domain/ports/vault-salt.repository.port';

describe('GetOrCreateVaultSaltUseCase', () => {
  it('devuelve el salt existente si ya hay uno', async () => {
    const vaultSaltRepository: Pick<
      VaultSaltRepositoryPort,
      'findByUserId' | 'create'
    > = {
      findByUserId: jest.fn().mockResolvedValue({
        userId: 'user-1',
        salt: 'existing-salt',
        createdAt: new Date(),
      }),
      create: jest.fn(),
    };

    const useCase = new GetOrCreateVaultSaltUseCase(vaultSaltRepository);
    const result = await useCase.execute({ userId: 'user-1' });

    expect(result.salt).toBe('existing-salt');
    expect(vaultSaltRepository.create).not.toHaveBeenCalled();
  });

  it('genera y persiste un salt nuevo si no existe', async () => {
    const vaultSaltRepository: Pick<
      VaultSaltRepositoryPort,
      'findByUserId' | 'create'
    > = {
      findByUserId: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation((userId: string, salt: string) =>
          Promise.resolve({ userId, salt, createdAt: new Date() }),
        ),
    };

    const useCase = new GetOrCreateVaultSaltUseCase(vaultSaltRepository);
    const result = await useCase.execute({ userId: 'user-1' });

    expect(result.salt).toBeTruthy();
    expect(Buffer.from(result.salt, 'base64').length).toBe(16);
    expect(vaultSaltRepository.create).toHaveBeenCalledWith(
      'user-1',
      result.salt,
    );
  });
});
