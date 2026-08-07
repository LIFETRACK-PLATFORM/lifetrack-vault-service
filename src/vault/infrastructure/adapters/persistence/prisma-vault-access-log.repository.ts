import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateVaultAccessLogData,
  VaultAccessLogRepositoryPort,
} from '../../../domain/ports/vault-access-log.repository.port';
import { VaultAccessLogMapper } from './vault-access-log.mapper';

@Injectable()
export class PrismaVaultAccessLogRepository implements VaultAccessLogRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVaultAccessLogData) {
    const raw = await this.prisma.vaultAccessLog.create({
      data: {
        userId: data.userId,
        vaultItemId: data.vaultItemId,
      },
    });
    return VaultAccessLogMapper.toDomain(raw);
  }
}
