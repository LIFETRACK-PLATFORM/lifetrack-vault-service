import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { VaultSaltRepositoryPort } from '../../../domain/ports/vault-salt.repository.port';
import { VaultSaltMapper } from './vault-salt.mapper';

@Injectable()
export class PrismaVaultSaltRepository implements VaultSaltRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const raw = await this.prisma.vaultMasterKeySalt.findUnique({
      where: { userId },
    });
    return raw ? VaultSaltMapper.toDomain(raw) : null;
  }

  async create(userId: string, salt: string) {
    const raw = await this.prisma.vaultMasterKeySalt.create({
      data: { userId, salt },
    });
    return VaultSaltMapper.toDomain(raw);
  }
}
