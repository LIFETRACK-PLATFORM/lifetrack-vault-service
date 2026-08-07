import { Module } from '@nestjs/common';
import { GetOrCreateVaultSaltUseCase } from './application/use-cases/get-or-create-vault-salt.use-case';
import { CreateVaultItemUseCase } from './application/use-cases/create-vault-item.use-case';
import { ListVaultItemsUseCase } from './application/use-cases/list-vault-items.use-case';
import { GetEncryptedVaultItemUseCase } from './application/use-cases/get-encrypted-vault-item.use-case';
import { UpdateVaultItemUseCase } from './application/use-cases/update-vault-item.use-case';
import { DeleteVaultItemUseCase } from './application/use-cases/delete-vault-item.use-case';
import {
  EVENT_PUBLISHER,
  VAULT_ACCESS_LOG_REPOSITORY,
  VAULT_ITEM_REPOSITORY,
  VAULT_SALT_REPOSITORY,
} from './domain/ports/tokens';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PrismaVaultItemRepository } from './infrastructure/adapters/persistence/prisma-vault-item.repository';
import { PrismaVaultAccessLogRepository } from './infrastructure/adapters/persistence/prisma-vault-access-log.repository';
import { PrismaVaultSaltRepository } from './infrastructure/adapters/persistence/prisma-vault-salt.repository';
import { NatsEventPublisher } from './infrastructure/adapters/messaging/nats-event.publisher';
import { VaultController } from './presentation/controllers/vault.controller';
import type { VaultItemRepositoryPort } from './domain/ports/vault-item.repository.port';
import type { VaultAccessLogRepositoryPort } from './domain/ports/vault-access-log.repository.port';
import type { VaultSaltRepositoryPort } from './domain/ports/vault-salt.repository.port';
import type { EventPublisherPort } from './domain/ports/event.publisher.port';

@Module({
  controllers: [VaultController],
  providers: [
    PrismaService,
    {
      provide: VAULT_ITEM_REPOSITORY,
      useClass: PrismaVaultItemRepository,
    },
    {
      provide: VAULT_ACCESS_LOG_REPOSITORY,
      useClass: PrismaVaultAccessLogRepository,
    },
    {
      provide: VAULT_SALT_REPOSITORY,
      useClass: PrismaVaultSaltRepository,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: NatsEventPublisher,
    },
    {
      provide: GetOrCreateVaultSaltUseCase,
      useFactory: (vaultSaltRepo: VaultSaltRepositoryPort) =>
        new GetOrCreateVaultSaltUseCase(vaultSaltRepo),
      inject: [VAULT_SALT_REPOSITORY],
    },
    {
      provide: CreateVaultItemUseCase,
      useFactory: (
        vaultItemRepo: VaultItemRepositoryPort,
        publisher: EventPublisherPort,
      ) => new CreateVaultItemUseCase(vaultItemRepo, publisher),
      inject: [VAULT_ITEM_REPOSITORY, EVENT_PUBLISHER],
    },
    {
      provide: ListVaultItemsUseCase,
      useFactory: (vaultItemRepo: VaultItemRepositoryPort) =>
        new ListVaultItemsUseCase(vaultItemRepo),
      inject: [VAULT_ITEM_REPOSITORY],
    },
    {
      provide: GetEncryptedVaultItemUseCase,
      useFactory: (
        vaultItemRepo: VaultItemRepositoryPort,
        accessLogRepo: VaultAccessLogRepositoryPort,
        publisher: EventPublisherPort,
      ) =>
        new GetEncryptedVaultItemUseCase(
          vaultItemRepo,
          accessLogRepo,
          publisher,
        ),
      inject: [
        VAULT_ITEM_REPOSITORY,
        VAULT_ACCESS_LOG_REPOSITORY,
        EVENT_PUBLISHER,
      ],
    },
    {
      provide: UpdateVaultItemUseCase,
      useFactory: (vaultItemRepo: VaultItemRepositoryPort) =>
        new UpdateVaultItemUseCase(vaultItemRepo),
      inject: [VAULT_ITEM_REPOSITORY],
    },
    {
      provide: DeleteVaultItemUseCase,
      useFactory: (vaultItemRepo: VaultItemRepositoryPort) =>
        new DeleteVaultItemUseCase(vaultItemRepo),
      inject: [VAULT_ITEM_REPOSITORY],
    },
  ],
})
export class VaultModule {}
