import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';

export type VaultItemProps = {
  userId: string;
  site: string;
  username: string;
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
  createdAt: Date;
  updatedAt: Date;
};

export class VaultItemEntity extends AggregateRoot<VaultItemProps> {
  constructor(props: VaultItemProps, id?: string) {
    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get site(): string {
    return this.props.site;
  }

  get username(): string {
    return this.props.username;
  }

  get encryptedBlob(): string {
    return this.props.encryptedBlob;
  }

  get iv(): string {
    return this.props.iv;
  }

  get salt(): string {
    return this.props.salt;
  }

  get encryptionVersion(): string {
    return this.props.encryptionVersion;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  belongsTo(userId: string): boolean {
    return this.props.userId === userId;
  }
}
