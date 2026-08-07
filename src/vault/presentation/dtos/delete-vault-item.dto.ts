import { IsString, MinLength } from 'class-validator';

export class DeleteVaultItemDto {
  @IsString()
  @MinLength(1)
  vaultItemId: string;
}
