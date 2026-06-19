# La Troncal — Plataforma de Gestión Publicitaria

Plataforma web integral para automatizar la venta, cobro y recepción de archivos de espacios publicitarios para la revista **"La Troncal"**. El sistema permite a los clientes seleccionar un espacio publicitario en una revista interactiva 3D, pagarlo, subir su material gráfico y generar una base de datos automatizada para campañas de marketing.

**URL de Producción:** [https://latroncal-publicidad.web.app](https://latroncal-publicidad.web.app)

---

## 🚀 Tecnologías

- **Frontend:** React 19, TypeScript, Vite 6
- **Estilos:** Tailwind CSS v4, Framer Motion (Animaciones fluidas)
- **Revista Interactiva:** `react-pageflip`
- **Backend (BaaS):** Firebase (Firestore, Storage, Auth, Hosting)
- **Procesamiento de Pagos:** Payway (vía Cloud Functions en Node.js)
- **Íconos:** Lucide React

---

## 🛠️ Estado Actual del Proyecto

El proyecto se encuentra en un estado funcional avanzado. La plataforma está 100% conectada a Firebase y está desplegada en internet.

### Hitos completados:
- [x] **Base de Datos en Tiempo Real:** Los espacios, precios, configuraciones y notificaciones se guardan y actualizan instantáneamente en Firebase Firestore.
- [x] **Seguridad y Autenticación:** El Panel de Administrador (`/admin`) está completamente protegido usando Firebase Authentication. Además, las Reglas de Seguridad de Firestore aseguran que *únicamente* el UID del dueño pueda leer o escribir en tablas sensibles.
- [x] **Gestión de Espacios:** Se pueden liberar (borrar) espacios individualmente o de manera masiva.
- [x] **Gestión de Clientes:** Se agregó una base de datos automática. Al realizar una compra, el sistema guarda al cliente, fecha y datos de contacto, permitiendo filtrarlos y exportarlos en `.csv` para email marketing.
- [x] **Exportación ZIP:** Los diseños subidos por los clientes pueden ser descargados de manera agrupada en un solo archivo `.zip` para enviarlos a la imprenta.
- [x] **Diseño Corporativo:** Adaptación completa a la paleta de colores y tipografía oficial de `latroncal.com.ar`.
- [x] **Despliegue Continuo:** Aplicación desplegada y funcional en Firebase Hosting.

---

## 🏗️ Arquitectura de Carpetas

- `/src/components`: Componentes reutilizables de UI (Botones, Tarjetas, layout, etc.).
- `/src/pages`: Las páginas principales (Landing, Selección de Espacio, Checkout y Dashboard Admin).
- `/src/hooks`: Conexiones y lógica de negocio con Firebase (`useAuth`, `useSlots`, `useClients`, etc.).
- `/src/types`: Definiciones de TypeScript (interfaces de base de datos).
- `/src/lib`: Scripts de conexión de librerías externas (Firebase, Payway).
- `/functions`: Servidor Node.js para Firebase Cloud Functions (Procesa los pagos de forma segura sin exponer credenciales al cliente).

---

## 🔐 Acceso al Administrador

1. Ingresar a `https://latroncal-publicidad.web.app/admin`
2. Usar el **Email** y la **Contraseña** registrados en Firebase Console.
3. Si el ingreso es exitoso, el sistema desbloquea el panel (Dashboard, Precios, Ediciones, Clientes, Materiales, Exportación).

---

## 💻 Comandos Útiles de Desarrollo

```bash
# Iniciar servidor local (con hot-reload)
npm run dev

# Chequear tipado y compilar proyecto
npm run build

# Subir a internet (Firebase Hosting)
npx firebase deploy --only hosting

# Actualizar reglas de base de datos
npx firebase deploy --only firestore:rules
```
