export type UpdateVaultItemInput = {
  userId: string;
  vaultItemId: string;
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
};
