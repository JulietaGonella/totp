import express from 'express'; 
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import { saveTotpSecret, getTotpSecret } from './qrController.js';

const app = express();
app.use(express.json());

let secret; // Se mantiene en memoria solo para este ejemplo simple

app.get('/generate-qr', async (req, res) => {
  const { email, appName } = req.query;
  if (!email || !appName) {
    return res.status(400).json({ error: 'Faltan email o appName' });
  }

  try {
    const secretDB = await getTotpSecret(email, appName);
    if (secretDB) {
      secret = {
        ascii: secretDB.ascii,
        hex: secretDB.hex,
        base32: secretDB.base32,
      };
      return res.status(200).json({ secret: secret.base32, message: 'Secreto ya existe' });
    }
  } catch (err) {
    console.error('❌ Error cargando secreto de DB:', err);
  }

  secret = speakeasy.generateSecret({ length: 20 });

  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: email,
    issuer: appName,
    encoding: 'base32',
  });

  try {
    await saveTotpSecret(email, appName, secret, otpauthUrl);
  } catch (err) {
    console.warn('No se pudo guardar en DB, pero seguimos funcionando.');
  }

  qrcodeTerminal.generate(otpauthUrl, { small: true });

  qrcode.toDataURL(otpauthUrl, (err, data_url) => {
    if (err) {
      res.status(500).json({ error: 'Error generando QR' });
    } else {
      res.json({ secret: secret.base32, qrcode: data_url });
    }
  });
});

app.post('/verify-totp', async (req, res) => {
  const { email, appName, token } = req.body;

  if (!email || !appName || !token) {
    return res.status(400).json({ error: 'Faltan email, appName o token' });
  }

  try {
    const secretDB = await getTotpSecret(email, appName);
    if (!secretDB) {
      return res.status(404).json({ error: 'Secreto no encontrado para este usuario' });
    }

    const verified = speakeasy.totp.verify({
      secret: secretDB.base32,
      encoding: 'base32',
      token: token,
      window: 1
    });

    if (verified) {
      res.json({ success: true, message: 'Token válido 🤙🏼' });
    } else {
      res.status(400).json({ success: false, message: 'Token inválido 👎🏼' });
    }
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/generate-totp', (req, res) => {
  if (!secret) {
    return res.status(400).send('Secret no definido. Generar QR primero.');
  }
  const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
  res.json({ token });
});

app.listen(3000, () => console.log('Server en port 3000...'));
