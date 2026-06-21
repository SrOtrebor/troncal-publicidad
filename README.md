# La Troncal - Plataforma de Publicidad

Plataforma de autogestión de espacios publicitarios para la revista **La Troncal**. Permite a los anunciantes explorar las diferentes dimensiones disponibles, visualizar costos en tiempo real y contratar directamente la pauta publicitaria.

## 🚀 Características Principales

### Para los Anunciantes (Clientes)
- **Catálogo de Espacios**: Visualización interactiva de tamaños de avisos publicitarios con previsualizaciones gráficas.
- **Precios Transparentes**: Costos calculados dinámicamente según la edición actual.
- **Flujo de Contratación (Checkout)**: Sistema paso a paso que recopila datos fiscales, información de contacto y métodos de pago (transferencia o Mercado Pago).
- **Subida de Materiales**: Capacidad para que el cliente cargue su propia pieza gráfica (.pdf, .jpg, etc) y defina el enlace (URL, WhatsApp, Instagram) que se vinculará en la versión digital.

### Para el Administrador (Dashboard)
- **Gestión de Ediciones**: Creación y edición de las revistas bimestrales, definiendo las fechas de cierre de imprenta.
- **Control de Inventario**: Permite establecer cupos o límites de cantidad para cada tamaño de espacio (ej: solo 4 medias páginas). Notificación automática de "Agotado".
- **Precios Dinámicos**: Herramienta para modificar el costo de cada tipo de espacio publicitario en segundos.
- **Links de Pago Personalizados**: Opción de generar links únicos de pago con un precio o descuento cerrado previamente por WhatsApp con un anunciante, salteando el catálogo público.
- **Gestión de Clientes y Materiales**: Panel para descargar los comprobantes de pago y piezas gráficas suministradas por los compradores.

## 🛠 Stack Tecnológico

- **Frontend**: React (con Vite), TypeScript.
- **Estilos y UI**: Tailwind CSS, Framer Motion (para animaciones), Lucide React (íconos).
- **Base de Datos**: Firebase Firestore.
- **Autenticación**: Firebase Auth.
- **Almacenamiento**: Firebase Storage (para comprobantes y gráficas).
- **Backend / Lógica de Pago**: Firebase Cloud Functions.
- **Hosting**: Firebase Hosting.

## ⚙️ Estructura de la Base de Datos (Firestore)

- `editions`: Registra las revistas bimestrales, sus fechas límite e inventario de espacios (`maxSlots`).
- `config`: Contiene documentos globales como `pricing` y `settings`.
- `slots`: Representa cada espacio vendido o creado.
- `customLinks`: Almacena los links de pago únicos creados por el administrador.
- `clients`: Historial de anunciantes y compras realizadas.
- `notifications`: Notificaciones internas para el dashboard del administrador.

## 💻 Instalación y Desarrollo Local

1. Clonar el repositorio.
2. Instalar las dependencias con NPM:
   ```bash
   npm install
   ```
3. Levantar el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## 🚀 Despliegue (Producción)

La aplicación está conectada directamente con **Firebase Hosting**. Para publicar nuevos cambios de código:

1. Compilar el proyecto para producción:
   ```bash
   npm run build
   ```
2. Desplegar los cambios (Hosting y Reglas de Firestore):
   ```bash
   npx firebase deploy
   ```

---
*Desarrollado para la revista de Nordelta "La Troncal" por estudioprecinto.com.*
