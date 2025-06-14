// Environment validation for production deployment
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  // Validate Clerk keys format
  const clerkPublicKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  
  if (clerkPublicKey && !clerkPublicKey.startsWith('pk_')) {
    throw new Error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with "pk_"');
  }
  
  if (clerkSecretKey && !clerkSecretKey.startsWith('sk_')) {
    throw new Error('CLERK_SECRET_KEY must start with "sk_"');
  }

  console.log('✅ Environment validation passed');
}

// Run validation in production
if (process.env.NODE_ENV === 'production') {
  validateEnvironment();
}
