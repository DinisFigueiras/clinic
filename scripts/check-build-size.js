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

// Netlify free tier limits
const NETLIFY_FUNCTION_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
const NETLIFY_SITE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB (soft limit)

console.log('\n🚦 Netlify Free Tier Status:');
console.log('=============================');

if (totalSize > NETLIFY_SITE_SIZE_LIMIT) {
  console.log('⚠️  WARNING: Build size exceeds recommended limit for Netlify free tier');
} else {
  console.log('✅ Build size is within Netlify free tier limits');
}

if (serverSize > NETLIFY_FUNCTION_SIZE_LIMIT) {
  console.log('❌ ERROR: Server bundle exceeds Netlify function size limit');
  process.exit(1);
} else {
  console.log('✅ Server bundle size is acceptable');
}

console.log(`\n📈 Usage: ${((totalSize / NETLIFY_SITE_SIZE_LIMIT) * 100).toFixed(1)}% of recommended limit`);
console.log('');
