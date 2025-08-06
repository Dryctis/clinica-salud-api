// server/src/routes/servicioRoute.js

import { Router } from 'express';
// ¡CORREGIDO! Ahora importamos 'crearServicio' desde el archivo correcto 'servicioController.js'
import { 
    crearServicio, 
    obtenerServicios, 
    obtenerServicioPorId, 
    actualizarServicio, 
    eliminarServicio 
} from '../controllers/servicioController.js'; // <-- NOMBRE CORREGIDO
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Solo el rol de 'admin' puede gestionar los servicios
const rolesAdmin = ['admin'];

// Rutas protegidas para la gestión de servicios
router.post('/', authMiddleware, roleMiddleware(rolesAdmin), crearServicio);
router.get('/', authMiddleware, roleMiddleware(rolesAdmin), obtenerServicios);
router.get('/:id', authMiddleware, roleMiddleware(rolesAdmin), obtenerServicioPorId);
router.put('/:id', authMiddleware, roleMiddleware(rolesAdmin), actualizarServicio);
router.delete('/:id', authMiddleware, roleMiddleware(rolesAdmin), eliminarServicio);

export default router;
