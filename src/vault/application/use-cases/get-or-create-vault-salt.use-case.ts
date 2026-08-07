import { randomBytes } from 'crypto';
import type { VaultSaltRepositoryPort } from '../../domain/ports/vault-salt.repository.port';
import type { GetOrCreateVaultSaltInput } from '../dtos/get-or-create-vault-salt.input';

const MASTER_KEY_SALT_BYTES = 16;

export class GetOrCreateVaultSaltUseCase {
  constructor(private readonly vaultSaltRepository: VaultSaltRepositoryPort) {}

  async execute(input: GetOrCreateVaultSaltInput) {
    const existing = await this.vaultSaltRepository.findByUserId(input.userId);
    if (existing) {
      return { salt: existing.salt };
    }

    const salt = randomBytes(MASTER_KEY_SALT_BYTES).toString('base64');
    const created = await this.vaultSaltRepository.create(input.userId, salt);

    return { salt: created.salt };
  }
}
