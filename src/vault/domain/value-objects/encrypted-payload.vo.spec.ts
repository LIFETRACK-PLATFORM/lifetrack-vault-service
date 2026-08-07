import { EncryptedPayload } from './encrypted-payload.vo';
import { InvalidEncryptedFormatError } from '../exceptions/vault.errors';

const validIv = Buffer.alloc(12, 1).toString('base64');
const validSalt = Buffer.alloc(16, 2).toString('base64');
const validBlob = Buffer.alloc(32, 3).toString('base64');

describe('EncryptedPayload', () => {
  it('acepta un payload cifrado con formato válido', () => {
    const payload = new EncryptedPayload({
      encryptedBlob: validBlob,
      iv: validIv,
      salt: validSalt,
      encryptionVersion: 'v1',
    });

    expect(payload.encryptionVersion).toBe('v1');
  });

  it('rechaza iv con longitud distinta de 12 bytes', () => {
    expect(
      () =>
        new EncryptedPayload({
          encryptedBlob: validBlob,
          iv: Buffer.alloc(8).toString('base64'),
          salt: validSalt,
          encryptionVersion: 'v1',
        }),
    ).toThrow(InvalidEncryptedFormatError);
  });

  it('rechaza encryptedBlob menor a 16 bytes', () => {
    expect(
      () =>
        new EncryptedPayload({
          encryptedBlob: Buffer.alloc(8).toString('base64'),
          iv: validIv,
          salt: validSalt,
          encryptionVersion: 'v1',
        }),
    ).toThrow(InvalidEncryptedFormatError);
  });

  it('rechaza salt menor a 16 bytes', () => {
    expect(
      () =>
        new EncryptedPayload({
          encryptedBlob: validBlob,
          iv: validIv,
          salt: Buffer.alloc(8).toString('base64'),
          encryptionVersion: 'v1',
        }),
    ).toThrow(InvalidEncryptedFormatError);
  });

  it('rechaza encryptionVersion vacío', () => {
    expect(
      () =>
        new EncryptedPayload({
          encryptedBlob: validBlob,
          iv: validIv,
          salt: validSalt,
          encryptionVersion: '  ',
        }),
    ).toThrow(InvalidEncryptedFormatError);
  });
});
