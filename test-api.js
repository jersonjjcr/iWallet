const http = require('http');

function testAPI() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Estado:', res.statusCode);
            console.log('Respuesta:', data);
            console.log('✅ API funcionando correctamente!');
        });
    });

    req.on('error', (err) => {
        console.error('Error:', err.message);
    });

    req.end();
}

// Esperar 1 segundo para asegurar que el servidor esté listo
setTimeout(testAPI, 1000);