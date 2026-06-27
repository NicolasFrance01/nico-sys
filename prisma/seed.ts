import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const password = await bcrypt.hash('Ndf010399', 10);
  
  await sql`
    INSERT INTO "User" (id, username, password, role, "createdAt")
    VALUES ('cuid_admin', 'nfrance', ${password}, 'ADMIN', NOW())
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;
  `;
  
  console.log('Seed completed successfully!');
}

main().catch(console.error);
