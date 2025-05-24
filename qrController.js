import db from './db.js';

export async function saveTotpSecret(email, appName, secret, otpauthUrl) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO totp_secrets (email, appName, ascii, hex, base32, otpauth_url)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        ascii = VALUES(ascii),
        hex = VALUES(hex),
        base32 = VALUES(base32),
        otpauth_url = VALUES(otpauth_url),
        updatedAt = CURRENT_TIMESTAMP
    `;

    db.query(
      query,
      [email, appName, secret.ascii, secret.hex, secret.base32, otpauthUrl],
      (err, results) => {
        if (err) {
          console.error('❌ Error guardando en base de datos:', err);
          reject(err);
        } else {
          console.log('✅ Secreto TOTP guardado en DB');
          resolve(results);
        }
      }
    );
  });
}

export async function getTotpSecret(email, appName) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ascii, hex, base32, otpauth_url FROM totp_secrets
      WHERE email = ? AND appName = ?
      LIMIT 1
    `;

    db.query(query, [email, appName], (err, results) => {
      if (err) {
        reject(err);
      } else if (results.length === 0) {
        resolve(null);  // No existe secreto
      } else {
        resolve(results[0]);
      }
    });
  });
}

