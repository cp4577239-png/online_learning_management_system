import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

const sameSite = process.env.COOKIE_SAME_SITE ?? 'lax';
if (!['strict', 'lax', 'none'].includes(sameSite)) {
  throw new Error('COOKIE_SAME_SITE must be strict, lax, or none');
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required('MONGODB_URI'),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  frontendOrigins: required('FRONTEND_ORIGIN').split(',').map((origin) => origin.trim()),
  cookieSameSite: sameSite as 'strict' | 'lax' | 'none',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('PORT must be a valid TCP port');
}
if (env.cookieSameSite === 'none' && !env.cookieSecure) {
  throw new Error('COOKIE_SECURE=true is required when COOKIE_SAME_SITE=none');
}
