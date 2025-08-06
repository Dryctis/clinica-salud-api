// server/src/controllers/servicioController.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para crear un nuevo servicio
const crearServicio = async (req, res) => {
    const { name, description, duration, price } = req.body;

    if (!name || !duration || !price) {
        return res.status(400).json({ mensaje: 'El nombre, la duración y el precio del servicio son obligatorios' });
    }

    try {
        const nuevoServicio = await prisma.service.create({
            data: {
                name,
                description,
                duration,
                price,
            },
        });
        return res.status(201).json({ mensaje: 'Servicio creado exitosamente', servicio: nuevoServicio });
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ... (El resto de las funciones como obtenerServicios, etc., permanecen igual)

const obtenerServicios = async (req, res) => {
    try {
        const servicios = await prisma.service.findMany();
        return res.status(200).json({ mensaje: 'Servicios obtenidos exitosamente', servicios });
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerServicioPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const servicio = await prisma.service.findUnique({
            where: { id },
        });

        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado' });
        }

        return res.status(200).json({ mensaje: 'Servicio obtenido exitosamente', servicio });
    } catch (error) {
        console.error('Error al obtener el servicio por ID:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const actualizarServicio = async (req, res) => {
    const { id } = req.params;
    const { name, description, duration, price } = req.body;

    try {
        const servicioActualizado = await prisma.service.update({
            where: { id },
            data: { name, description, duration, price },
        });
        return res.status(200).json({ mensaje: 'Servicio actualizado exitosamente', servicio: servicioActualizado });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Servicio no encontrado para actualizar' });
        }
        console.error('Error al actualizar el servicio:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const eliminarServicio = async (req, res) => {
    const { id } = req.params;

    try {
        const servicioEliminado = await prisma.service.delete({
            where: { id },
        });
        return res.status(200).json({ mensaje: 'Servicio eliminado exitosamente', servicio: servicioEliminado });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Servicio no encontrado para eliminar' });
        }
        console.error('Error al eliminar el servicio:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export {
    crearServicio,
    obtenerServicios,
    obtenerServicioPorId,
    actualizarServicio,
    eliminarServicio
};
