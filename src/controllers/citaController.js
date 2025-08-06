// server/src/controllers/citaController.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @description Crea una nueva cita. Si el paciente no existe, lo crea automáticamente.
 * @param {object} req - Objeto de la solicitud HTTP.
 * @param {object} res - Objeto de la respuesta HTTP.
 */
const crearCita = async (req, res) => {
    // CORRECCIÓN: Se desestructuran los campos "nombre" y "apellido" del body
    const { nombre, apellido, serviceId, startTime, status } = req.body;

    if (!nombre || !apellido || !serviceId || !startTime) {
        return res.status(400).json({ mensaje: 'Nombre, apellido, ID de servicio y hora de inicio de cita son obligatorios.' });
    }

    try {
        // --- LÓGICA: Buscar o crear el paciente ---
        let patient = await prisma.patient.findFirst({
            where: {
                // CORRECCIÓN: Se usan las variables "nombre" y "apellido"
                primerNombre: nombre,
                apellido: apellido
            }
        });

        // Si el paciente no existe, lo creamos
        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    // CORRECCIÓN: Se usan las variables "nombre" y "apellido"
                    primerNombre: nombre,
                    apellido: apellido,
                }
            });
            console.log(`Paciente '${nombre} ${apellido}' creado automáticamente.`);
        }
        
        // Verificamos que el servicio exista
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
        }

        const start = new Date(startTime);
        const durationInMilliseconds = service.duration * 60 * 1000;
        const endTime = new Date(start.getTime() + durationInMilliseconds);

        // Usamos el ID del paciente (ya sea existente o nuevo) para crear la cita
        const nuevaCita = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                serviceId,
                startTime: start,
                endTime,
                status: status || 'pending',
            },
            include: {
                patient: true,
                service: true
            }
        });

        return res.status(201).json({ mensaje: 'Cita creada exitosamente', cita: nuevaCita });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2003') {
            const constraint = error.meta?.constraint;
            let errorMessage = `Error de clave foránea. Verifique que el ${constraint.includes('patientId') ? 'nombre del paciente' : 'ID del servicio'} sea válido.`;
            return res.status(400).json({ mensaje: errorMessage, detalles: error.message });
        }
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

/**
 * @description Obtiene todas las citas.
 * @param {object} req - Objeto de la solicitud HTTP.
 * @param {object} res - Objeto de la respuesta HTTP.
 */
const obtenerCitas = async (req, res) => {
    try {
        const citas = await prisma.appointment.findMany({
            include: {
                patient: true,
                service: true
            },
            // **CAMBIO:** Se agrega el ordenamiento para asegurar un orden consistente
            // Ordena las citas por la hora de inicio (startTime) en orden ascendente
            orderBy: {
                startTime: 'asc'
            }
        });
        return res.status(200).json({ mensaje: 'Citas obtenidas exitosamente', citas });
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

/**
 * @description Obtiene una cita por su ID.
 * @param {object} req - Objeto de la solicitud HTTP.
 * @param {object} res - Objeto de la respuesta HTTP.
 */
const obtenerCitaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const cita = await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                service: true
            }
        });

        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada.' });
        }

        return res.status(200).json({ mensaje: 'Cita obtenida exitosamente', cita });
    } catch (error) {
        console.error('Error al obtener la cita por ID:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

/**
 * @description Actualiza una cita por su ID.
 * @param {object} req - Objeto de la solicitud HTTP.
 * @param {object} res - Objeto de la respuesta HTTP.
 */
const actualizarCita = async (req, res) => {
    const { id } = req.params;
    const { patientFirstName, patientLastName, serviceId, startTime, status } = req.body;

    try {
        const citaExistente = await prisma.appointment.findUnique({ where: { id } });
        if (!citaExistente) {
            return res.status(404).json({ mensaje: 'Cita no encontrada para actualizar.' });
        }

        let patientId = citaExistente.patientId;
        if (patientFirstName && patientLastName) {
            let patient = await prisma.patient.findFirst({
                where: {
                    primerNombre: patientFirstName,
                    apellido: patientLastName
                }
            });
            if (!patient) {
                     patient = await prisma.patient.create({
                        data: {
                             primerNombre: patientFirstName,
                             apellido: patientLastName,
                        }
                     });
            }
            patientId = patient.id;
        }

        const dataToUpdate = {
            patientId,
            serviceId,
            startTime: startTime ? new Date(startTime) : undefined,
            status,
        };

        if (serviceId || startTime) {
            const service = await prisma.service.findUnique({
                where: { id: serviceId || citaExistente.serviceId }
            });
            if (service) {
                const start = new Date(startTime || citaExistente.startTime);
                const durationInMilliseconds = service.duration * 60 * 1000;
                dataToUpdate.endTime = new Date(start.getTime() + durationInMilliseconds);
            }
        }

        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                delete dataToUpdate[key];
            }
        });

        const citaActualizada = await prisma.appointment.update({
            where: { id },
            data: dataToUpdate,
            include: {
                patient: true,
                service: true
            }
        });

        return res.status(200).json({ mensaje: 'Cita actualizada exitosamente', cita: citaActualizada });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Cita no encontrada para actualizar.' });
        }
        console.error('Error al actualizar la cita:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

/**
 * @description Elimina una cita por su ID.
 * @param {object} req - Objeto de la solicitud HTTP.
 * @param {object} res - Objeto de la respuesta HTTP.
 */
const eliminarCita = async (req, res) => {
    const { id } = req.params;

    try {
        const citaEliminada = await prisma.appointment.delete({
            where: { id },
        });

        return res.status(200).json({ mensaje: 'Cita eliminada exitosamente', cita: citaEliminada });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Cita no encontrada para eliminar.' });
        }
        console.error('Error al eliminar la cita:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

export {
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita
};
