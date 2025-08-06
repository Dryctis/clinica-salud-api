// server/src/controllers/authController.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Función para el registro de un nuevo usuario
const registerUser = async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: role || 'patient',
            },
        });

        const token = jwt.sign({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role
        }, jwtSecret, { expiresIn: '1h' });

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', token, usuario: newUser });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ mensaje: 'El email ya está en uso' });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para obtener todos los usuarios (solo para admins)
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return res.status(200).json({ usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para actualizar un usuario (solo para admins)
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, role } = req.body;

    try {
        const usuarioActualizado = await prisma.user.update({
            where: { id },
            data: {
                email,
                firstName,
                lastName,
                role,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return res.status(200).json({ mensaje: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
        }
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Función para eliminar un usuario (solo para admins)
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioEliminado = await prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
            }
        });
        return res.status(200).json({ mensaje: 'Usuario eliminado exitosamente', usuario: usuarioEliminado });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar' });
        }
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export {
    registerUser,
    loginUser,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
};
