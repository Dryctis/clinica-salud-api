// server/src/routes/authRoute.js

import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    obtenerUsuarios, 
    actualizarUsuario, 
    eliminarUsuario 
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Definimos el rol que puede acceder a estas rutas
const rolesAdmin = ['admin'];

// Rutas de acceso público
router.post('/login', loginUser);

// Rutas protegidas que solo los admins pueden usar
// La ruta de registro ahora está protegida para que solo un admin pueda crear nuevos usuarios
router.post('/register', authMiddleware, roleMiddleware(rolesAdmin), registerUser);
router.get('/users', authMiddleware, roleMiddleware(rolesAdmin), obtenerUsuarios);
router.put('/users/:id', authMiddleware, roleMiddleware(rolesAdmin), actualizarUsuario);
router.delete('/users/:id', authMiddleware, roleMiddleware(rolesAdmin), eliminarUsuario);

export default router;
