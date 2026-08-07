import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateVaultItemData,
  UpdateVaultItemData,
  VaultItemRepositoryPort,
} from '../../../domain/ports/vault-item.repository.port';
import { VaultItemMapper } from './vault-item.mapper';

@Injectable()
export class PrismaVaultItemRepository implements VaultItemRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const raw = await this.prisma.vaultItem.findUnique({ where: { id } });
    return raw ? VaultItemMapper.toDomain(raw) : null;
  }

  async findByIdAndUserId(id: string, userId: string) {
    const raw = await this.prisma.vaultItem.findFirst({
      where: { id, userId },
    });
    return raw ? VaultItemMapper.toDomain(raw) : null;
  }

  async listByUserId(userId: string) {
    const rows = await this.prisma.vaultItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((raw) => VaultItemMapper.toDomain(raw));
  }

  async create(data: CreateVaultItemData) {
    const raw = await this.prisma.vaultItem.create({
      data: {
        userId: data.userId,
        site: data.site,
        username: data.username,
        encryptedBlob: data.encryptedBlob,
        iv: data.iv,
        salt: data.salt,
        encryptionVersion: data.encryptionVersion,
      },
    });
    return VaultItemMapper.toDomain(raw);
  }

  async update(id: string, data: UpdateVaultItemData) {
    const raw = await this.prisma.vaultItem.update({
      where: { id },
      data: {
        site: data.site,
        username: data.username,
        encryptedBlob: data.encryptedBlob,
        iv: data.iv,
        salt: data.salt,
        encryptionVersion: data.encryptionVersion,
      },
    });
    return VaultItemMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vaultItem.delete({ where: { id } });
  }
}
