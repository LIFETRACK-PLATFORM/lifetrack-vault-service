export type VaultMasterKeySaltRecord = {
  userId: string;
  salt: string;
  createdAt: Date;
};

export interface VaultSaltRepositoryPort {
  findByUserId(userId: string): Promise<VaultMasterKeySaltRecord | null>;
  create(userId: string, salt: string): Promise<VaultMasterKeySaltRecord>;
}
