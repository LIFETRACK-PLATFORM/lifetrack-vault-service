import { VaultAccessLogEntity } from '../entities/vault-access-log.entity';

export type CreateVaultAccessLogData = {
  userId: string;
  vaultItemId: string;
};

export interface VaultAccessLogRepositoryPort {
  create(data: CreateVaultAccessLogData): Promise<VaultAccessLogEntity>;
}
