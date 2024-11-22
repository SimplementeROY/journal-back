// Server creation and configuration
const http = require('http');
const app = require('./src/app');
const { spawn } = require('child_process');

// Config .env
require('dotenv').config();


const PORT = process.env.PORT || 3000;

// Función para reiniciar la aplicación
const restartServer = () => {
    console.log('Restarting the server...');
    spawn('node', [__filename], {
        stdio: 'inherit', // Comparte la salida del proceso hijo
        shell: true,
    });
    process.exit(1); // Termina el proceso actual después de lanzar el nuevo
};

// Server creation
const server = http.createServer(app);

server.listen(PORT);

// Listeners
server.on('listening', () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on('error', (error) => {
    console.log('Server error: ', error);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
    restartServer();
});

// Manejo de promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    restartServer();
});