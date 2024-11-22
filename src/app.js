// Creation and configuration of the Express APP
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Route configuration
app.use('/api', require('./routes/api.routes'));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Error max_user_connections
    if (err.message && err.message.includes('max_user_connections')) {
        return res.status(503).json({
            error: 'Servicio no disponible',
            message: 'Se ha excedido la cantidad de peticiones permitidas. Vuelva a intentarlo más tarde.'
        });
    }
    // Otros errores
    res.status(500).json({
        error: 'Error Interno en el servidor',
        message: err.message
    });
})

module.exports = app;