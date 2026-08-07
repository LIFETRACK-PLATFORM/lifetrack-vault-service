import { VaultItemEntity } from '../entities/vault-item.entity';

export type CreateVaultItemData = {
  userId: string;
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
};

export type UpdateVaultItemData = {
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
};

export interface VaultItemRepositoryPort {
  findById(id: string): Promise<VaultItemEntity | null>;
  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<VaultItemEntity | null>;
  listByUserId(userId: string): Promise<VaultItemEntity[]>;
  create(data: CreateVaultItemData): Promise<VaultItemEntity>;
  update(id: string, data: UpdateVaultItemData): Promise<VaultItemEntity>;
  delete(id: string): Promise<void>;
}
