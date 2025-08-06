// server/src/routes/citaRutas.js

import { Router } from 'express';
import {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita
} from '../controllers/citaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Roles permitidos para la gestión de citas
const rolesAdminDoctor = ['admin', 'doctor'];

// Rutas protegidas para la gestión de citas
// Todas las rutas ahora requieren autenticación y un rol autorizado
router.post('/', authMiddleware, roleMiddleware(rolesAdminDoctor), crearCita);
router.get('/', authMiddleware, roleMiddleware(rolesAdminDoctor), obtenerCitas);
router.get('/:id', authMiddleware, roleMiddleware(rolesAdminDoctor), obtenerCitaPorId);

// **NUEVA RUTA AÑADIDA:** Ahora se puede usar PATCH para actualizar
router.patch('/:id', authMiddleware, roleMiddleware(rolesAdminDoctor), actualizarCita);
// La ruta PUT original para actualizaciones completas
router.put('/:id', authMiddleware, roleMiddleware(rolesAdminDoctor), actualizarCita);

router.delete('/:id', authMiddleware, roleMiddleware(rolesAdminDoctor), eliminarCita);

export default router;
