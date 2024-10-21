require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

// Configurar Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Probar la conexión con la base de datos
sequelize.authenticate()
    .then(() => console.log('Conexión exitosa con la base de datos'))
    .catch(err => console.error('Error de conexión:', err));

// Definir los modelos
const Categoria = sequelize.define('Categoria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

// Sincronizar los modelos con la base de datos
sequelize.sync();

const app = express();
app.use(bodyParser.json());

// Rutas CRUD
app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio, categoria_id } = req.body;
        const producto = await Producto.create({ nombre, precio, categoria_id });
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.findAll({ include: Categoria });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria_id } = req.body;
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.nombre = nombre;
            producto.precio = precio;
            producto.categoria_id = categoria_id;
            await producto.save();
            res.status(200).json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (producto) {
            await producto.destroy();
            res.status(200).json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
