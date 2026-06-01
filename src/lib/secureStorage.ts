const STORAGE_KEY = 'future_goose_api_key';
const STORAGE_KEY_BASE_URL = 'future_goose_base_url';
const STORAGE_KEY_MASTER = 'future_goose_master_key';

function getMasterKey(): string {
  let key = localStorage.getItem(STORAGE_KEY_MASTER);
  if (!key) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    key = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(STORAGE_KEY_MASTER, key);
  }
  return key;
}

async function deriveKey(masterKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterKey),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('future_goose_salt_v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptValue(value: string): Promise<string> {
  if (!value) return '';

  try {
    const masterKey = getMasterKey();
    const key = await deriveKey(masterKey);

    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(value)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (e) {
    console.error('Encryption failed, falling back to plaintext', e);
    return value;
  }
}

export async function decryptValue(encryptedValue: string): Promise<string> {
  if (!encryptedValue) return '';

  try {
    const masterKey = getMasterKey();
    const key = await deriveKey(masterKey);

    const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error('Decryption failed, returning raw value', e);
    return encryptedValue;
  }
}

export function maskValue(value: string): string {
  if (!value || value.length <= 8) return '****';
  return `${value.slice(0, 4)}${'*'.repeat(value.length - 8)}${value.slice(-4)}`;
}

export async function getSecureApiKey(): Promise<string> {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return '';
  if (encrypted.startsWith('encrypted:')) {
    return decryptValue(encrypted.replace('encrypted:', ''));
  }
  return encrypted;
}

export async function setSecureApiKey(value: string): Promise<void> {
  if (!value) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const encrypted = await encryptValue(value);
  localStorage.setItem(STORAGE_KEY, `encrypted:${encrypted}`);
}

export function getSecureBaseUrl(): string {
  return localStorage.getItem(STORAGE_KEY_BASE_URL) || 'https://open.bigmodel.cn/api/paas/v4';
}

export function setSecureBaseUrl(value: string): void {
  localStorage.setItem(STORAGE_KEY_BASE_URL, value);
}
