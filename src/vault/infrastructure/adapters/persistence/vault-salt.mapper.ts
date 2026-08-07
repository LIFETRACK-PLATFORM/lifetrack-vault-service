import { VaultMasterKeySalt as PrismaVaultMasterKeySalt } from 'generated/prisma/client';
import { VaultMasterKeySaltRecord } from '../../../domain/ports/vault-salt.repository.port';

export class VaultSaltMapper {
  static toDomain(raw: PrismaVaultMasterKeySalt): VaultMasterKeySaltRecord {
    return {
      userId: raw.userId,
      salt: raw.salt,
      createdAt: raw.createdAt,
    };
  }
}
