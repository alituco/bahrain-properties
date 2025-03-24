import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || '4000',
  databaseUrl: process.env.DATABASE_URL || '',
  flaskBaseUrl: process.env.FLASK_URL || 'http://localhost:5001',
  jwtSecret: process.env.JWT_SECRET || 'secret-jwt',
  emailHost: process.env.EMAIL_HOST || 'no_email_host set in env',
  emailPort: process.env.EMAIL_PORT || 'no_email_port set in env',
  emailUser: process.env.EMAIL_USER || 'no email_user set in env',
  emailPass: process.env.EMAIL_PASS || 'no email_pass set in env',
  
  // add the env variables as needed here
};
