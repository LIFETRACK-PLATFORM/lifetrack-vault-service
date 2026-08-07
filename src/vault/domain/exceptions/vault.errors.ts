export abstract class DomainError extends Error {}

export class InvalidEncryptedFormatError extends DomainError {
  constructor(message = 'Formato de payload cifrado inválido') {
    super(message);
  }
}

export class VaultItemNotFoundError extends DomainError {
  constructor(vaultItemId: string) {
    super(`El item de bóveda ${vaultItemId} no existe`);
  }
}

export class ForbiddenVaultAccessError extends DomainError {
  constructor(vaultItemId: string) {
    super(`No tienes permiso para acceder al item de bóveda ${vaultItemId}`);
  }
}
