import { VaultItem as PrismaVaultItem } from 'generated/prisma/client';
import { VaultItemEntity } from '../../../domain/entities/vault-item.entity';

export class VaultItemMapper {
  static toDomain(raw: PrismaVaultItem): VaultItemEntity {
    return new VaultItemEntity(
      {
        userId: raw.userId,
        site: raw.site,
        username: raw.username,
        category: raw.category,
        encryptedBlob: raw.encryptedBlob,
        iv: raw.iv,
        salt: raw.salt,
        encryptionVersion: raw.encryptionVersion,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
