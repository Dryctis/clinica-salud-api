// server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Importaciones corregidas para usar el sufijo 'Route.js'
import authRoutes from './src/routes/authRoute.js';
import pacienteRoutes from './src/routes/pacienteRoute.js';
import servicioRoutes from './src/routes/servicioRoute.js';
import citaRoutes from './src/routes/citaRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ¡Aquí está el cambio para CORS!
app.use(cors({
    origin: 'https://clinica-salud-frontend.vercel.app', // <-- ¡Esta es la URL específica de tu frontend!
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

app.use(express.json());

// Conexión de las rutas al servidor
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});