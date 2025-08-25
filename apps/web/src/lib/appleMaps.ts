import { SignJWT, importPKCS8 } from 'jose';
import { readFile } from 'fs/promises';

export async function generateAppleMapsToken(): Promise<string> {
  const privateKey = await readFile(process.env.APPLE_MAPS_PRIVATE_KEY_PATH!, 'utf8');
  const key = await importPKCS8(privateKey, 'ES256');

  const token = await new SignJWT({
    origin: process.env.APP_ALLOWED_ORIGIN,
  })
    .setProtectedHeader({
      alg: 'ES256',
      kid: process.env.APPLE_MAPS_KEY_ID,
    })
    .setIssuedAt()
    .setIssuer(process.env.APPLE_TEAM_ID!)
    .setExpirationTime('15m')
    .sign(key);

  return token;
}