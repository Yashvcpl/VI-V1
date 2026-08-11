const https = require('http');
const http = require('http');
const url = 'http://localhost:3000/careers/Markrting%20Advisor';

const req = http.get(url, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const marker = '<script id="__NEXT_DATA__" type="application/json">';
    const start = body.indexOf(marker);
    if (start === -1) {
      console.log('NO_PAYLOAD');
      console.log(body.slice(0, 2000));
      return;
    }
    const open = start + marker.length;
    const close = body.indexOf('</script>', open);
    const jsonText = body.slice(open, close);
    const payload = JSON.parse(jsonText);
    console.log(JSON.stringify(payload.err || payload, null, 2));
  });
});
req.on('error', (err) => {
  console.error('ERR', err.message);
  process.exit(1);
});