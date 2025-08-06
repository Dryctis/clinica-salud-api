// server/src/middleware/roleMiddleware.js

// Esta función devuelve un middleware que verifica si el rol del usuario
// está en la lista de roles permitidos.
export const roleMiddleware = (rolesPermitidos) => {
    // El middleware toma la petición (req), la respuesta (res) y el siguiente middleware (next).
    return (req, res, next) => {
        // En nuestro authMiddleware, adjuntamos el objeto de usuario decodificado a req.
        const usuario = req.user;

        // Si no hay un usuario en la petición, algo está mal.
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Usuario no autenticado o token inválido' });
        }

        // Buscamos si el rol del usuario está incluido en la lista de roles permitidos.
        if (!rolesPermitidos.includes(usuario.role)) {
            // Si el rol no está permitido, devolvemos un error 403 Forbidden.
            return res.status(403).json({ mensaje: 'Acceso denegado: No tienes los permisos necesarios' });
        }

        // Si el rol es válido, continuamos al siguiente middleware o a la función del controlador.
        next();
    };
};
