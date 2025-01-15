
# Nodepop 

Nodepop es una aplicación web desarrollada para la venta de artículos, donde los usuarios pueden publicar, buscar y gestionar productos a través de funcionalidades avanzadas de filtrado y paginación, además de poseer funcionalidades como internacionalización, la gestión de productos con imágenes, y una API REST.

## Índice de Funcionalidades Avanzadas

### 1. Internacionalización

- **Objetivo**: Convertir el sitio web de la aplicación Nodepop en multi-idioma.
- **Idiomas disponibles**: Español e Inglés.
- **Detalles**:
  - Agregar un selector de idioma para alternar entre inglés y español.

### 2. Creación de un Producto con Imagen

- **Objetivo**: Añadir al sitio web la funcionalidad de creación de productos.
- **Detalles**:
  - Crear una página accesible desde el menú para registrar productos.
  - Permitir subir imágenes durante el registro.

### 3. API REST

- **Objetivo**: Implementar una API REST con funcionalidad básica de autenticación y gestión de productos.
- **Endpoints**:
  - `POST /api/login`: Retorna un JWT para autenticación.
  - `GET /api/products`: Lista productos filtrados, con paginación, ordenación y selección de campos. Solo muestra productos del usuario autenticado.
  - `GET /api/products/<productID>`: Retorna un producto específico.
  - `POST /api/products`: Crea un producto y permite subir una imagen.
  - `PUT /api/products/<productID>`: Actualiza un producto.
  - `DELETE /api/products/<productID>`: Elimina un producto.

## Despliegue

### Instalación de Dependencias

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```sh
npm install
```

En el primer despliegue, copia el archivo `.env.example` a `.env` y personaliza las variables de entorno según tu configuración:

```sh
cp .env.example .env
```

Puedes ejecutar el siguiente comando para vaciar la base de datos y crear datos iniciales:

```sh
npm run initDB
```

Este script crea usuarios y productos de ejemplo para probar la funcionalidad de la aplicación. Hay dos usuarios para probar la aplicacion:

admin@example.com
user1@example.com

El password por defecto para todos los usuarios es :"1234"

## Inicio

Para iniciar la aplicación en modo producción:

```sh
npm start
```

Para iniciar la aplicación en modo desarrollo:

```sh
npm run dev
```

## API

URL Base: `http://localhost:3000/api`

### Lista de Productos

Método: **GET** `/api/product`

Ejemplo de respuesta:

```json
{
    "results": [
        {
            "_id": "677fa59fa76ebe22c5467e95",
            "name": "Calcetines",
            "owner": "677fa59fa76ebe22c5467e88",
            "price": 2000,
            "image": "",
            "tags": [
                "work",
                "lifestyle"
            ],
            "__v": 0
        }
    ],
    "count": 9
}
```
## productlist 
Get /api/products

## productlist por Product ID
Get /api/products/:productId

## create a product
Post /api/products

## update a product
Put /api/products/:productId

## Delete a product
Delete /api/products/:productId

### Registro y Autenticación

Los usuarios pueden registrarse, iniciar sesión y acceder a funcionalidades privadas, como la gestión de sus propios productos. Al iniciar sesión, se muestra un menú de usuario con opciones como "Mis productos", "Nuevo producto" y "Logout".

### Gestión de Productos

Cada usuario puede crear, ver y eliminar sus propios productos. Solo pueden gestionarse los productos propios del usuario logueado. Los productos contienen la siguiente información:

- Nombre
- Propietario
- Precio
- Foto
- Tags (uno o varios)

## Documentación de la API

Swagger se ha configurado para documentar la API de manera interactiva. Puedes acceder a la documentación en:

```
http://localhost:3000/api-doc
```
