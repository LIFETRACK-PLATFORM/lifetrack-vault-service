import { Entity } from '../../../shared/domain/building-blocks/Entity';

export type VaultAccessLogProps = {
  userId: string;
  vaultItemId: string;
  accessedAt: Date;
};

export class VaultAccessLogEntity extends Entity<VaultAccessLogProps> {
  constructor(props: VaultAccessLogProps, id?: string) {
    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get vaultItemId(): string {
    return this.props.vaultItemId;
  }

  get accessedAt(): Date {
    return this.props.accessedAt;
  }
}
