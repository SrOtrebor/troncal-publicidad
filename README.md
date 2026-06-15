# La Troncal — Plataforma de Gestión Publicitaria

Plataforma web integral para automatizar la venta, cobro y recepción de archivos de espacios publicitarios para la revista "La Troncal".

## 🚀 Tecnologías

- **Frontend:** React 19, TypeScript, Vite 6
- **Estilos:** Tailwind CSS v4, Framer Motion
- **Revista Interactiva:** `react-pageflip`
- **Backend (BaaS):** Firebase (Firestore, Storage, Auth)

---

## 🛠️ Estado Actual del Proyecto (Junio 2026)

Actualmente, **la base de datos y la plataforma web están conectadas al 100% con Firebase**. Atrás han quedado los datos simulados: los espacios, precios y notificaciones se gestionan en tiempo real. 

Además, se ha configurado la infraestructura Backend (Firebase Cloud Functions) lista para recibir las credenciales de producción de **Payway**.

### Hitos completados:
- [x] Conexión bidireccional en tiempo real con Firestore para el Panel de Administrador y la Tienda.
- [x] Estructura segura del servidor de pagos armada (Cloud Functions en Node 22).
- [x] Adaptación completa del diseño visual a la paleta de colores oficial de `latroncal.com.ar`.
- [x] Integración de los logotipos vectoriales de la marca.

### Próximos pasos pendientes (Punto de Retorno):
1. **Seguridad del Panel:** Configurar Firebase Authentication para que solo el dueño pueda entrar al `/admin`.
2. **Archivos a la Nube:** Conectar el formulario final del cliente para que envíe sus diseños de anuncios a Firebase Storage.
3. **Credenciales Payway:** Esperar las llaves de desarrollo de Payway para conectarlas en `functions/src/index.ts` y activar los pagos reales.
---

## 📁 Archivos de Configuración Importantes

- `firestore.rules`: Contiene las reglas temporales de lectura/escritura para la base de datos que deben publicarse en Firebase Console.
- `storage.rules`: Contiene las reglas para que los clientes puedan subir sus imágenes y links de forma segura.
- `src/lib/seed.ts`: Script que empuja los datos iniciales (edición de ejemplo, lista de precios base) hacia el Firebase vacío para poder probar la UI.
- `.env.local`: Archivo (ignorado por git) donde se guardan las credenciales reales del proyecto de Firebase.

---

## 💻 Comandos Útiles

```bash
# Iniciar servidor de desarrollo (con hot-reload)
npm run dev

# Chequear tipado y errores en TypeScript
npm run build

# Levantar vista previa de la build de producción
npm run preview
```
