const fs = require('fs');

try {
    const data = fs.readFileSync('data.json', 'utf8');
    JSON.parse(data);
    console.log('data.json is valid');
} catch (e) {
    console.error('Error parsing data.json:', e.message);
}
