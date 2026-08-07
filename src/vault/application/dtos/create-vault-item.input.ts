export type CreateVaultItemInput = {
  userId: string;
  site: string;
  username: string;
  category?: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
};
