import { VaultAccessLog as PrismaVaultAccessLog } from 'generated/prisma/client';
import { VaultAccessLogEntity } from '../../../domain/entities/vault-access-log.entity';

export class VaultAccessLogMapper {
  static toDomain(raw: PrismaVaultAccessLog): VaultAccessLogEntity {
    return new VaultAccessLogEntity(
      {
        userId: raw.userId,
        vaultItemId: raw.vaultItemId,
        accessedAt: raw.accessedAt,
      },
      raw.id,
    );
  }
}
