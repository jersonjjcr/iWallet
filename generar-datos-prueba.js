// Script para generar datos de prueba en la API
const fetch = require('node-fetch');

const baseURL = 'http://localhost:3000/api';

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
        
        console.log(`✅ ${method} ${endpoint}: ${response.status}`);
        if (response.status >= 400) {
            console.log('❌ Error:', result);
        }
        
        return { success: response.status < 400, data: result };
    } catch (error) {
        console.error('❌ Network Error:', error.message);
        return { success: false, error: error.message };
    }
}

async function generarDatosDePrueba() {
    console.log('🚀 Generando datos de prueba para iWallet API');
    console.log('================================================\n');

    // 1. Registrar usuario
    console.log('1️⃣ Registrando usuario...');
    const registerResult = await apiRequest('/auth/register', 'POST', {
        username: 'demo_user',
        email: 'demo@iwallet.com',
        password: 'demo123456'
    });

    if (!registerResult.success) {
        console.log('ℹ️  El usuario probablemente ya existe, intentando login...');
    }

    // 2. Login
    console.log('2️⃣ Iniciando sesión...');
    const loginResult = await apiRequest('/auth/login', 'POST', {
        username: 'demo_user',
        password: 'demo123456'
    });

    if (!loginResult.success) {
        console.log('❌ No se pudo iniciar sesión');
        return;
    }

    const token = loginResult.data.token;
    console.log('✅ Token JWT obtenido\n');

    // 3. Obtener categorías
    console.log('3️⃣ Obteniendo categorías...');
    const categoriesResult = await apiRequest('/categories', 'GET', null, token);
    
    if (!categoriesResult.success || categoriesResult.data.length === 0) {
        console.log('❌ No se pudieron obtener categorías');
        return;
    }

    const categories = categoriesResult.data;
    console.log(`✅ ${categories.length} categorías encontradas\n`);

    // 4. Crear gastos de ejemplo
    console.log('4️⃣ Creando gastos de ejemplo...');
    
    const gastosEjemplo = [
        // Alimentación
        { category_id: categories[0].id, amount: 12.50, description: 'Desayuno en cafetería', date: '2023-12-01' },
        { category_id: categories[0].id, amount: 25.80, description: 'Almuerzo restaurante italiano', date: '2023-12-02' },
        { category_id: categories[0].id, amount: 18.90, description: 'Cena comida rápida', date: '2023-12-03' },
        
        // Transporte  
        { category_id: categories[1].id, amount: 45.00, description: 'Gasolina del auto', date: '2023-12-01' },
        { category_id: categories[1].id, amount: 3.50, description: 'Boleto de autobús', date: '2023-12-02' },
        { category_id: categories[1].id, amount: 12.00, description: 'Uber al trabajo', date: '2023-12-04' },
        
        // Entretenimiento
        { category_id: categories[2].id, amount: 15.99, description: 'Entrada al cine', date: '2023-12-02' },
        { category_id: categories[2].id, amount: 8.50, description: 'Café con amigos', date: '2023-12-03' },
        { category_id: categories[2].id, amount: 35.00, description: 'Concierto local', date: '2023-12-05' },
        
        // Salud
        { category_id: categories[3].id, amount: 45.00, description: 'Consulta médica', date: '2023-12-01' },
        { category_id: categories[3].id, amount: 22.75, description: 'Medicamentos farmacia', date: '2023-12-02' },
        
        // Compras
        { category_id: categories[4].id, amount: 89.99, description: 'Camisa nueva', date: '2023-12-03' },
        { category_id: categories[4].id, amount: 15.50, description: 'Artículos de limpieza', date: '2023-12-04' },
        
        // Servicios
        { category_id: categories[5].id, amount: 65.00, description: 'Factura de internet', date: '2023-12-01' },
        { category_id: categories[5].id, amount: 120.00, description: 'Factura de electricidad', date: '2023-12-05' },
    ];

    let gastosCreados = 0;
    for (const gasto of gastosEjemplo) {
        const result = await apiRequest('/expenses', 'POST', gasto, token);
        if (result.success) {
            gastosCreados++;
        }
        // Pequeña pausa para no saturar el servidor
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ ${gastosCreados} gastos creados exitosamente\n`);

    // 5. Crear una categoría personalizada
    console.log('5️⃣ Creando categoría personalizada...');
    const newCategoryResult = await apiRequest('/categories', 'POST', {
        name: 'Tecnología',
        description: 'Gastos en dispositivos electrónicos y software',
        color: '#2196F3'
    }, token);

    if (newCategoryResult.success) {
        // Agregar algunos gastos a la nueva categoría
        const techExpenses = [
            { category_id: newCategoryResult.data.category.id, amount: 299.99, description: 'Smartphone nuevo', date: '2023-12-06' },
            { category_id: newCategoryResult.data.category.id, amount: 9.99, description: 'App premium', date: '2023-12-07' },
        ];

        for (const expense of techExpenses) {
            await apiRequest('/expenses', 'POST', expense, token);
        }
        console.log('✅ Categoría "Tecnología" creada con gastos\n');
    }

    // 6. Mostrar resumen
    console.log('6️⃣ Obteniendo resumen final...');
    const summaryResult = await apiRequest('/expenses/stats/summary', 'GET', null, token);
    
    if (summaryResult.success) {
        const stats = summaryResult.data;
        console.log('\n📊 RESUMEN DE DATOS GENERADOS:');
        console.log('=====================================');
        console.log(`💰 Total de gastos: ${stats.totalExpenses}`);
        console.log(`💵 Monto total: $${stats.totalAmount}`);
        console.log(`📈 Gasto promedio: $${stats.averageExpense.toFixed(2)}`);
        console.log(`⬆️  Gasto máximo: $${stats.maxExpense}`);
        console.log(`⬇️  Gasto mínimo: $${stats.minExpense}`);
        console.log('=====================================\n');
    }

    console.log('🎉 ¡Datos de prueba generados exitosamente!');
    console.log('💡 Ahora puedes usar Postman para explorar la API con datos reales');
    console.log('🔗 Abre: http://localhost:3000');
}

// Ejecutar el script
generarDatosDePrueba().catch(console.error);