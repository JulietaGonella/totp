import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: 'Juli43449100',
  database: 'TOTP',
});


connection.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
  } else {
    console.log('✅ Conexión a MySQL exitosa');
  }
});

export default connection;
