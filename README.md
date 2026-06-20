# La Troncal Publicidad - Panel y Landing Page

Plataforma integral para gestión de espacios publicitarios de "La Troncal - Guía Comercial Ruta 27".

## Resumen de Funcionalidades Implementadas

A lo largo del proyecto, se han integrado y mejorado múltiples características tanto en la interfaz orientada a clientes (Landing Page) como en el panel de administración.

### 1. Landing Page y Experiencia de Usuario (Front-end)
*   **Rebranding y Textos**:
    *   Se adaptó la comunicación para referirse al producto como **"Guía"** en lugar de "revista".
    *   Actualización de llamados a la acción, reemplazando contadores estáticos (ej. "5 espacios libres") por textos dinámicos ("Espacios disponibles").
    *   Se agregó la aclaración de que "Los precios son sin IVA (+ IVA 2.5%). ¡Aprovechá nuestra promoción por 3 meses!".
*   **Propuesta de Valor (6 Formatos por 1)**:
    *   Se reemplazó la clásica galería de flyers por una **sección dinámica e integrada al diseño** que lista los 6 beneficios de publicitar: Aviso Impreso, Guía Digital, Reposteo en Redes, Publinota, Entrevista radial (Camino Emprendedor) y Eventos Exclusivos.
*   **Alcance Hiperlocal**:
    *   Se detalló el alcance estratégico mencionando zonas clave con alto poder de consumo: *Nordelta, Villanueva, Bancalari, Maschwitz y Puertos*.
*   **Enlaces y Redes**:
    *   Integración del Linktree oficial en la comunicación ([linktr.ee/LatroncaldeNordelta](https://linktr.ee/LatroncaldeNordelta)).

### 2. Panel de Administración (Back-office)
*   **Ampliación de Formatos Publicitarios**:
    *   Se añadieron 4 nuevas categorías de espacios destacados: `retiro de tapa` (página entera), `índice` (media página), `retiro de contratapa` (página entera) y `contratapa` (página entera).
*   **Configuración de Precios Dinámica**:
    *   El módulo de "Configuración de Precios" del administrador ahora detecta automáticamente estas nuevas 4 columnas de valores, permitiendo editarlas en tiempo real desde la plataforma.
*   **Gestión de Ediciones (Edición de metadatos)**:
    *   Se implementó la funcionalidad en el botón "Editar" dentro del listado de ediciones.
    *   Los administradores pueden modificar directamente el *Título*, el *Bimestre (Periodo)* y la *Fecha de Cierre de Imprenta* de la edición actual mediante un formulario en pantalla.

### 3. Base de Datos y Despliegue
*   Actualización de la metadata estática y estructuración de los tipos (`types/index.ts`).
*   Despliegues continuos y exitosos a Firebase Hosting.
*   Sincronización con el repositorio de Git en GitHub.

---

### Tecnologías Utilizadas
*   React + TypeScript
*   Vite (Build Tool)
*   Tailwind CSS (Estilos y Diseño UI)
*   Framer Motion (Animaciones)
*   Firebase (Hosting, Firestore Database)

> **Sitio en Producción:** [https://latroncal-publicidad.web.app](https://latroncal-publicidad.web.app)
