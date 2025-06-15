const fs = require('fs');
const path = require('path');

// Function to get directory size
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        calculateSize(path.join(currentPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  if (fs.existsSync(dirPath)) {
    calculateSize(dirPath);
  }
  
  return totalSize;
}

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check build sizes
const buildDir = path.join(process.cwd(), '.next');
const staticDir = path.join(buildDir, 'static');
const serverDir = path.join(buildDir, 'server');

if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

const totalSize = getDirectorySize(buildDir);
const staticSize = getDirectorySize(staticDir);
const serverSize = getDirectorySize(serverDir);

console.log('\n📊 Build Size Analysis:');
console.log('========================');
console.log(`📁 Total Build Size: ${formatBytes(totalSize)}`);
console.log(`🎨 Static Assets: ${formatBytes(staticSize)}`);
console.log(`⚙️  Server Bundle: ${formatBytes(serverSize)}`);

// Vercel free tier limits
const VERCEL_FUNCTION_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
const VERCEL_SITE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB (soft limit)

console.log('\n🚦 Vercel Free Tier Status:');
console.log('===========================');

if (totalSize > VERCEL_SITE_SIZE_LIMIT) {
  console.log('⚠️  WARNING: Build size exceeds recommended limit for Vercel free tier');
} else {
  console.log('✅ Build size is within Vercel free tier limits');
}

if (serverSize > VERCEL_FUNCTION_SIZE_LIMIT) {
  console.log('❌ ERROR: Server bundle exceeds Vercel function size limit');
  process.exit(1);
} else {
  console.log('✅ Server bundle size is acceptable');
}

console.log(`\n📈 Usage: ${((totalSize / VERCEL_SITE_SIZE_LIMIT) * 100).toFixed(1)}% of recommended limit`);
console.log('');
