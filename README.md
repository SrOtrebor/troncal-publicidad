# La Troncal — Plataforma de Gestión Publicitaria

Plataforma web integral para automatizar la venta, cobro y recepción de archivos de espacios publicitarios para la revista "La Troncal".

## 🚀 Tecnologías

- **Frontend:** React 19, TypeScript, Vite 6
- **Estilos:** Tailwind CSS v4, Framer Motion
- **Revista Interactiva:** `react-pageflip`
- **Backend (BaaS):** Firebase (Firestore, Storage, Auth)

---

## 🛠️ Estado Actual del Proyecto (En Desarrollo)

Actualmente, **toda la interfaz gráfica y los flujos de usuario están terminados al 100%** utilizando datos simulados (`mockData`). Se ha configurado Firebase y nos encontramos en medio de la transición para usar la base de datos real en la nube.

### Tareas Inmediatas Pendientes (Punto de Retorno):
1. Publicar las reglas de seguridad de Firestore (ver `firestore.rules`).
2. Levantar el proyecto (`npm run dev`), entrar a `/admin` y presionar el botón **"Seed Firebase DB"**.
3. Empezar a cambiar el código fuente de los componentes para que lean de la base de datos real en vez del archivo local de mock.

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
