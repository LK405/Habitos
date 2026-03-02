# Proyecto Final - Hábitos

Este proyecto usa Node.js con Express y se conecta a una base de datos en MongoDB Atlas.

Pasos realizados:
- Se inicializó el proyecto con npm.
- Se instaló Express y Mongoose.
- Se creó un servidor básico en el puerto 3000.
- Se configuró un cluster gratuito en MongoDB Atlas.
- Se creó un usuario y se agregó la IP de acceso.
- Se copió la cadena de conexión y se probó en el código.
- Se verificó que el servidor se conecta correctamente a MongoDB Atlas.

Resultado:
El servidor Express funciona en http://localhost:3000 y está conectado a la base de datos en MongoDB Atlas. MongoDB Atlas:
- Cree un cluster gratuito.
- Agregué un usuario (`habitoUser`) con contraseña.
- Permití el acceso desde mi IP.
- Copié la cadena de conexión.

- Conecté el servidor a MongoDB Atlas usando Mongoose:
```js
mongoose.connect('mongodb+srv://habitoUser:TU_PASSWORD@habitoscluster.dxcppgb.mongodb.net/HabitosDB')

