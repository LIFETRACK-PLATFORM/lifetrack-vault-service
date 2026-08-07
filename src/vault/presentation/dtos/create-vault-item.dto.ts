import { IsString, MinLength } from 'class-validator';

export class CreateVaultItemDto {
  @IsString()
  @MinLength(1)
  site: string;

  @IsString()
  @MinLength(1)
  username: string;

  @IsString()
  @MinLength(1)
  encryptedBlob: string;

  @IsString()
  @MinLength(1)
  iv: string;

  @IsString()
  @MinLength(1)
  salt: string;

  @IsString()
  @MinLength(1)
  encryptionVersion: string;
}
