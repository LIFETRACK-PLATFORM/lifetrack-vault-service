export type CreateVaultItemInput = {
  userId: string;
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
};
