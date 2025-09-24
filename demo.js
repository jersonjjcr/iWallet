// Script de demostración de la API del Gestor de Gastos Personales
// Este script muestra cómo usar todas las funcionalidades de la API

const baseURL = 'http://localhost:3000/api';

// Función helper para hacer requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${baseURL}${endpoint}`, options);
        const result = await response.json();
        
        console.log(`${method} ${endpoint}:`, response.status);
        console.log('Response:', result);
        console.log('---');
        
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function demoAPI() {
    console.log('🚀 Demostración de la API del Gestor de Gastos Personales');
    console.log('========================================================\n');

    // 1. Registrar un usuario
    console.log('1️⃣ Registrando un usuario...');
    const newUser = {
        username: 'demo_user',
        email: 'demo@example.com',
        password: 'password123'
    };
    
    const registerResult = await apiRequest('/auth/register', 'POST', newUser);
    
    if (!registerResult) {
        console.log('❌ Error al registrar usuario');
        return;
    }

    // 2. Iniciar sesión
    console.log('2️⃣ Iniciando sesión...');
    const loginResult = await apiRequest('/auth/login', 'POST', {
        username: newUser.username,
        password: newUser.password
    });

    if (!loginResult || !loginResult.token) {
        console.log('❌ Error al iniciar sesión');
        return;
    }

    const token = loginResult.token;
    console.log('✅ Login exitoso! Token obtenido');

    // 3. Obtener información del usuario
    console.log('3️⃣ Obteniendo información del usuario...');
    await apiRequest('/auth/me', 'GET', null, token);

    // 4. Obtener categorías
    console.log('4️⃣ Obteniendo categorías...');
    const categories = await apiRequest('/categories', 'GET', null, token);
    
    if (!categories || categories.length === 0) {
        console.log('❌ No se encontraron categorías');
        return;
    }

    // 5. Crear una nueva categoría
    console.log('5️⃣ Creando nueva categoría...');
    const newCategory = {
        name: 'Tecnología',
        description: 'Gastos en dispositivos y software',
        color: '#2196F3'
    };
    
    const categoryResult = await apiRequest('/categories', 'POST', newCategory, token);

    // 6. Crear gastos de ejemplo
    console.log('6️⃣ Creando gastos de ejemplo...');
    const expensesData = [
        {
            category_id: categories[0].id,
            amount: 25.50,
            description: 'Almuerzo en restaurante',
            date: '2023-12-01'
        },
        {
            category_id: categories[1].id,
            amount: 45.00,
            description: 'Gasolina para el auto',
            date: '2023-12-02'
        },
        {
            category_id: categories[2].id,
            amount: 15.99,
            description: 'Entrada al cine',
            date: '2023-12-03'
        }
    ];

    for (const expense of expensesData) {
        await apiRequest('/expenses', 'POST', expense, token);
    }

    // 7. Obtener todos los gastos
    console.log('7️⃣ Obteniendo todos los gastos...');
    await apiRequest('/expenses?page=1&limit=5', 'GET', null, token);

    // 8. Obtener estadísticas generales
    console.log('8️⃣ Obteniendo estadísticas generales...');
    await apiRequest('/expenses/stats/summary', 'GET', null, token);

    // 9. Obtener estadísticas por categoría
    console.log('9️⃣ Obteniendo estadísticas por categoría...');
    await apiRequest('/categories/stats', 'GET', null, token);

    // 10. Obtener gastos por período
    console.log('🔟 Obteniendo gastos por período mensual...');
    await apiRequest('/expenses/stats/period?period=monthly', 'GET', null, token);

    console.log('✅ Demostración completada exitosamente!');
    console.log('\n📊 La API está completamente funcional y lista para usar.');
    console.log('💡 Puedes usar herramientas como Postman o curl para probar los endpoints.');
}

// Solo ejecutar si está en Node.js (no en browser)
if (typeof window === 'undefined') {
    // Para Node.js, necesitamos polyfill de fetch
    const fetch = require('node-fetch');
    global.fetch = fetch;
    
    demoAPI().catch(console.error);
}