// Simple build test script
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('Build test completed successfully!');
