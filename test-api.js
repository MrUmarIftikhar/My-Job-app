const https = require('https');

const options = {
  hostname: 'testapi.getlokalapp.com',
  path: '/common/jobs?page=1&limit=5',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response structure:');
      console.log(Object.keys(jsonData));
      
      if (jsonData.results) {
        console.log('\nResults is an array:', Array.isArray(jsonData.results));
        console.log('Number of results:', jsonData.results.length);
        if (jsonData.results.length > 0) {
          console.log('\nFirst result keys:', Object.keys(jsonData.results[0]));
        }
      } else {
        console.log('\nNo results property found in response');
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.end();