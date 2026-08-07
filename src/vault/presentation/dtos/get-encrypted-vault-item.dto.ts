import { IsString, MinLength } from 'class-validator';

export class GetEncryptedVaultItemDto {
  @IsString()
  @MinLength(1)
  vaultItemId: string;
}
