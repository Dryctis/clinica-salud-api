// server/src/controllers/pacienteController.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para crear un nuevo paciente
const crearPaciente = async (req, res) => {
    const { primerNombre, apellido, fechaNacimiento, genero, telefono, direccion, historialMedico } = req.body;

    if (!primerNombre || !apellido) {
        return res.status(400).json({ mensaje: 'El nombre y apellido del paciente son obligatorios' });
    }

    try {
        const data = {
            primerNombre,
            apellido,
            genero,
            telefono,
            direccion,
            historialMedico,
            fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        };

        const nuevoPaciente = await prisma.patient.create({
            data,
        });

        return res.status(201).json({ mensaje: 'Paciente creado exitosamente', paciente: nuevoPaciente });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// --- FUNCIÓN ACTUALIZADA CON LÓGICA DE BÚSQUEDA ---
// Función para obtener todos los pacientes (o buscar por nombre)
const obtenerPacientes = async (req, res) => {
    try {
        // Capturamos el parámetro de búsqueda 'search' de la URL (si existe)
        const { search } = req.query;

        let pacientes;
        if (search) {
            // Si hay un término de búsqueda, usamos Prisma para buscar
            // en 'primerNombre' o 'apellido' (la 'i' en 'contains' hace que no distinga entre mayúsculas y minúsculas)
            pacientes = await prisma.patient.findMany({
                where: {
                    OR: [
                        { primerNombre: { contains: search, mode: 'insensitive' } },
                        { apellido: { contains: search, mode: 'insensitive' } },
                    ],
                },
            });
        } else {
            // Si no hay término de búsqueda, devolvemos todos los pacientes
            pacientes = await prisma.patient.findMany();
        }

        return res.status(200).json({ mensaje: 'Pacientes obtenidos exitosamente', pacientes });
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para obtener un paciente por su ID
const obtenerPacientePorId = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await prisma.patient.findUnique({
            where: { id },
        });

        if (!paciente) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }

        return res.status(200).json({ mensaje: 'Paciente obtenido exitosamente', paciente });
    } catch (error) {
        console.error('Error al obtener el paciente por ID:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para actualizar la información de un paciente
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const { primerNombre, apellido, fechaNacimiento, genero, telefono, direccion, historialMedico } = req.body;

    try {
        const dataToUpdate = {
            primerNombre,
            apellido,
            genero,
            telefono,
            direccion,
            historialMedico,
            fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        };

        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                delete dataToUpdate[key];
            }
        });

        const pacienteActualizado = await prisma.patient.update({
            where: { id },
            data: dataToUpdate,
        });

        return res.status(200).json({ mensaje: 'Paciente actualizado exitosamente', paciente: pacienteActualizado });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Paciente no encontrado para actualizar' });
        }
        console.error('Error al actualizar el paciente:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para eliminar un paciente por su ID
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const pacienteEliminado = await prisma.patient.delete({
            where: { id },
        });

        return res.status(200).json({ mensaje: 'Paciente eliminado exitosamente', paciente: pacienteEliminado });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Paciente no encontrado para eliminar' });
        }
        console.error('Error al eliminar el paciente:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export {
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    actualizarPaciente,
    eliminarPaciente
};
