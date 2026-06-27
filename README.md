# NicoSys Manager

Gestor personal de sistemas, clientes y proyectos construido con Next.js 15, TailwindCSS 4, Prisma (Neon PostgreSQL) y Auth.js.

## Pasos para ejecutar el proyecto:

1. **Configurar Base de Datos (Neon)**
   Crea una base de datos en [Neon](https://neon.tech) y copia el "Connection String".

2. **Variables de Entorno**
   Renombra el archivo `.env.example` a `.env` y coloca tu `DATABASE_URL` de Neon.
   - `AUTH_SECRET`: Genera un string aleatorio seguro.
   - `MASTER_KEY`: Asegúrate de que tenga exactamente 32 caracteres (utilizado para encriptación AES de credenciales).

3. **Migraciones y Seed**
   Una vez configurado el `.env`, ejecuta los siguientes comandos para crear las tablas y el usuario administrador:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
   *Nota: El usuario por defecto será `nfrance` y la contraseña `Ndf010399`.*

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador e inicia sesión.
