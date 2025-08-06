// server/src/routes/pacienteRoute.js

import { Router } from 'express';
import { 
    crearPaciente, 
    obtenerPacientes, 
    obtenerPacientePorId, 
    actualizarPaciente, 
    eliminarPaciente 
} from '../controllers/pacienteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Roles permitidos para ver y crear pacientes
// Asegúrate de que el rol 'secretaria' esté definido en tu modelo de usuario si lo vas a usar.
const rolesAdminDoctorSecretaria = ['admin', 'doctor', 'secretaria'];

// Rutas protegidas para la gestión de pacientes
// Solo admin, doctor y secretaria pueden crear un nuevo paciente
router.post('/', authMiddleware, roleMiddleware(rolesAdminDoctorSecretaria), crearPaciente);

// Solo admin, doctor y secretaria pueden obtener el listado de todos los pacientes
router.get('/', authMiddleware, roleMiddleware(rolesAdminDoctorSecretaria), obtenerPacientes);

// Solo admin, doctor y secretaria pueden obtener un paciente por su ID
router.get('/:id', authMiddleware, roleMiddleware(rolesAdminDoctorSecretaria), obtenerPacientePorId);

// Solo admin, doctor y secretaria pueden actualizar la información de un paciente
router.put('/:id', authMiddleware, roleMiddleware(rolesAdminDoctorSecretaria), actualizarPaciente);

// Solo el admin puede eliminar un paciente, ya que es una acción destructiva
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminarPaciente);

export default router;
