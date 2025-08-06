Clínica Vida y Salud - Backend API
Este repositorio aloja la API RESTful central para la aplicación "Clínica Vida y Salud". Actúa como el motor de datos y lógica de negocio, proporcionando los servicios necesarios para la gestión de pacientes, citas y servicios, así como la autenticación de usuarios.

Descripción General
Este proyecto implementa una API robusta y escalable diseñada para soportar las operaciones de una clínica médica. Facilita la interacción con los datos a través de operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para las entidades clave: Pacientes, Servicios y Citas. Además, incorpora un sistema de autenticación de usuarios basado en JWT, garantizando un acceso seguro y controlado a los recursos.

Tecnologías Clave
La API está construida utilizando un stack moderno y eficiente para el desarrollo backend:

Node.js: Entorno de ejecución de JavaScript del lado del servidor.

Express.js: Framework web minimalista y flexible para Node.js, utilizado para construir la API REST.

Prisma ORM: Un ORM de próxima generación que simplifica la interacción con la base de datos, proporcionando un tipado seguro y una potente generación de clientes.

PostgreSQL: Base de datos relacional robusta y de código abierto, ideal para la integridad y consistencia de los datos.

Railway: Plataforma de despliegue utilizada para el alojamiento de la base de datos PostgreSQL, facilitando la gestión de la infraestructura.

JSON Web Tokens (JWT): Estándar para la creación de tokens de acceso seguros, utilizados para la autenticación sin estado.

Bcrypt: Biblioteca para el hash seguro de contraseñas, protegiendo la información sensible de los usuarios.

Configuración y Ejecución Local
Para poner en marcha la API en tu entorno de desarrollo, sigue los siguientes pasos:

1. Clonar el Repositorio
Abre tu terminal y ejecuta:

git clone https://github.com/Dryctis/clinica-salud-api.git
cd clinica-salud-api

2. Instalar Dependencias
Navega al directorio del proyecto y instala las dependencias de Node.js:

npm install
# O si usas Yarn:
# yarn install

3. Configurar Variables de Entorno
Crea un archivo .env en la raíz de tu proyecto. Este archivo contendrá las variables de entorno esenciales para que la API se conecte a la base de datos y funcione correctamente.

DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
JWT_SECRET="TU_SECRETO_JWT_SUPER_SEGURO_Y_LARGO"
PORT=5000

DATABASE_URL: La cadena de conexión a tu base de datos PostgreSQL (obtenida de Railway o tu proveedor).

JWT_SECRET: Una cadena de caracteres aleatoria y compleja. ¡Es crucial para la seguridad de tus tokens!

PORT: El puerto en el que la API escuchará las solicitudes (por defecto 5000).

4. Configurar la Base de Datos con Prisma
Aplica las migraciones de Prisma para crear o actualizar el esquema de tu base de datos:

npx prisma migrate dev --name initial_setup

Si ya tienes una base de datos con datos y solo necesitas generar el cliente Prisma:

npx prisma generate

5. Iniciar el Servidor
Una vez configurado, puedes iniciar el servidor de la API:

npm start
# Para desarrollo (con reinicio automático al guardar cambios):
# npm run dev

La API estará disponible en http://localhost:5000 (o el puerto que hayas configurado).

Endpoints de la API
La API expone los siguientes grupos de endpoints (requieren autenticación JWT en la mayoría de los casos):

Autenticación (/api/auth):

POST /login: Iniciar sesión de usuario.

POST /register: Registrar nuevos usuarios (posiblemente restringido a roles administrativos).

Pacientes (/api/pacientes):

GET /: Obtener todos los pacientes.

GET /:id: Obtener un paciente específico.

POST /: Crear un nuevo paciente.

PUT /:id: Actualizar un paciente existente.

DELETE /:id: Eliminar un paciente.

Servicios (/api/servicios):

GET /: Obtener todos los servicios.

POST /: Crear un nuevo servicio.

PUT /:id: Actualizar un servicio.

DELETE /:id: Eliminar un servicio.

Citas (/api/citas):

GET /: Obtener todas las citas.

POST /: Agendar una nueva cita.

PUT /:id: Actualizar una cita.

DELETE /:id: Cancelar o eliminar una cita.

(Nota: La mayoría de los endpoints están protegidos por middleware de autenticación y/o roles para asegurar que solo los usuarios autorizados puedan acceder o modificar los datos.)

Contribuciones
Las contribuciones son bienvenidas. Si encuentras un error, tienes una sugerencia de mejora o quieres añadir una nueva funcionalidad, no dudes en:

Abrir un Issue para describir el problema o la idea.

Crear un Pull Request con tus cambios.

