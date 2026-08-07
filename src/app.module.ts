import { Module } from '@nestjs/common';
import { VaultModule } from './vault/vault.module';

@Module({
  imports: [VaultModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
