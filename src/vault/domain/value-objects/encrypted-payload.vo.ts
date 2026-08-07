import { ValueObject } from '../../../shared/domain/building-blocks/ValueObject';
import { InvalidEncryptedFormatError } from '../exceptions/vault.errors';

export type EncryptedPayloadProps = {
  encryptedBlob: string;
  iv: string;
  salt: string;
  encryptionVersion: string;
};

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

function decodeBase64(value: string): Buffer {
  if (!BASE64_PATTERN.test(value)) {
    throw new InvalidEncryptedFormatError('Valor base64 inválido');
  }

  const decoded = Buffer.from(value, 'base64');
  if (decoded.length === 0 && value.length > 0) {
    throw new InvalidEncryptedFormatError('Valor base64 inválido');
  }

  return decoded;
}

export class EncryptedPayload extends ValueObject<EncryptedPayloadProps> {
  constructor(props: EncryptedPayloadProps) {
    EncryptedPayload.assertValid(props);
    super(props);
  }

  static assertValid(props: EncryptedPayloadProps): void {
    if (!props.encryptionVersion?.trim()) {
      throw new InvalidEncryptedFormatError('encryptionVersion es obligatorio');
    }

    const blobBytes = decodeBase64(props.encryptedBlob);
    if (blobBytes.length < 16) {
      throw new InvalidEncryptedFormatError(
        'encryptedBlob debe tener al menos 16 bytes',
      );
    }

    const ivBytes = decodeBase64(props.iv);
    if (ivBytes.length !== 12) {
      throw new InvalidEncryptedFormatError('iv debe ser exactamente 12 bytes');
    }

    const saltBytes = decodeBase64(props.salt);
    if (saltBytes.length < 16) {
      throw new InvalidEncryptedFormatError(
        'salt debe tener al menos 16 bytes',
      );
    }
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
}
