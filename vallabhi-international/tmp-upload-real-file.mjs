import fs from 'node:fs/promises';
const fileBuffer = await fs.readFile('./public/hero-banner.png');
const file = new File([fileBuffer], 'hero-banner.png', { type: 'image/png' });
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'banner');
const response = await fetch('http://127.0.0.1:3001/api/admin/upload', {
  method: 'POST',
  body: formData,
});
console.log('status', response.status);
console.log('body', await response.text());
