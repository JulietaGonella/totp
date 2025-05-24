
# Servidor de Autenticación TOTP

Este repositorio contiene un servidor simple para implementar autenticación de dos factores (2FA) usando TOTP (Time-based One-Time Password).

## Descripción

Este proyecto implementa un servidor API REST con Express que permite:

* Generar secretos TOTP y códigos QR para configurar aplicaciones autenticadoras
* Verificar tokens TOTP proporcionados por el usuario
* Generar tokens TOTP para pruebas

El sistema utiliza el estándar TOTP, compatible con aplicaciones autenticadoras como Google Authenticator, Microsoft Authenticator, Authy, entre otras.

## Requisitos previos

* Node.js (versión 14.x o superior)
* npm (gestor de paquetes de Node.js)

## Instalación

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/tuusuario/tu-repo-totp.git
   cd tu-repo-totp
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor:
   ```bash
   node index.js
   ```

El servidor se ejecutará en `http://localhost:3000`.

## Dependencias

* [express](https://www.npmjs.com/package/express): Framework web  para Node.js
* [speakeasy](https://www.npmjs.com/package/speakeasy): Implementación de TOTP y HOTP para autenticación de dos factores
* [qrcode](https://www.npmjs.com/package/qrcode): Generador de códigos QR
* [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal): Muestra códigos QR en la terminal

## Uso

### Generar un código QR y secreto TOTP

 **Endpoint** : `GET /generate-qr`

 **Descripción** : Genera un nuevo secreto TOTP y un código QR para configurar una aplicación autenticadora.

 **Solicitud** :

* Método: `GET`
* URL: `http://localhost:3000/generate-qr`

 **Respuesta** :

```json
{
  "secret": "K5BSIYSCPVBVALBWJI2G22ZVMZLVWMCB",
  "qrcode": "data:image/png;base64,..."
}
```

Usa una aplicación autenticadora como Google Authenticator, Microsoft Authenticator o Authy para escanear el código QR o ingresa el secreto manualmente.

### Verificar un token TOTP

 **Endpoint** : `POST /verify-totp`

 **Descripción** : Verifica si un token TOTP proporcionado es válido.

 **Solicitud** :

* Método: `POST`
* URL: `http://localhost:3000/verify-totp`
* Contenido (JSON):
  ```json
  {  "token": "123456"}
  ```

 **Respuestas posibles** :

* `🤙🏼🤙🏼🤙🏼🤙🏼` (200 OK): El token es válido
* `👎🏼👎🏼👎🏼👎🏼` (400 Bad Request): El token es inválido
* `Secret no definido. Generar QR primero.` (400 Bad Request): No se ha generado un secreto todavía

### Generar un token TOTP (para pruebas)

 **Endpoint** : `GET /generate-totp`

 **Descripción** : Genera un token TOTP actual basado en el secreto existente (útil para pruebas).

 **Solicitud** :

* Método: `GET`
* URL: `http://localhost:3000/generate-totp`

 **Respuesta** :

```json
{
  "token": "123456"
}
```

## Notas importantes

* **SOLO PARA DESARROLLO** : Esta implementación almacena el secreto en memoria y no es persistente. Para un entorno de producción, deberías almacenar los secretos en una base de datos segura.
* El código incluye un TODO para recordar implementar el almacenamiento del secreto en una base de datos.
* Los secretos generados tienen una longitud de 20 bytes para mayor seguridad.
* La URL de otpauth utiliza valores predeterminados (`app:johndoe@gmail.com` como etiqueta y `empresa` como emisor) que deberías personalizar según tu aplicación.

## Seguridad

Para un entorno de producción, considera estas mejoras:

1. Implementar persistencia segura de los secretos (base de datos cifrada)
2. Usar HTTPS para todas las comunicaciones
3. Implementar limitación de intentos para prevenir ataques de fuerza bruta
4. Personalizar los valores de etiqueta y emisor según tu aplicación
5. Implementar un manejo adecuado de errores y registro de eventos

## Postman Collection

Una colección de Postman está disponible para probar los endpoints del servicio:

## Licencia

RauloCoin
