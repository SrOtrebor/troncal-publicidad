# Próximos Pasos (TODO)

Esta es una lista de las tareas pendientes e integraciones que faltan para lanzar la plataforma completa a producción:

## 1. Integración con Payway (Pasarela de Pago)
- [ ] **Desactivar el Mock:** En `src/pages/Checkout.tsx`, el pago actualmente está simulado y se aprueba automáticamente en 2 segundos.
- [ ] **Configurar Variables de Entorno:** Añadir las llaves secretas (`SiteID`, `Private Key`, `Public Key`) otorgadas por Prisma/Payway en el archivo `.env` del servidor de Firebase Functions.
- [ ] **Modificar Cloud Function:** Asegurarse de que `functions/src/index.ts` hace el request real a la API REST de Payway para ejecutar la transacción en lugar de devolver un "OK" directo.

## 2. Subida Real de Material (Firebase Storage)
- [ ] **Implementar en Checkout:** En el último paso del `Checkout.tsx` ("upload"), hay que tomar el archivo (PDF/JPG) que selecciona el cliente y utilizar el método `uploadBytes` o `uploadBytesResumable` de Firebase Storage para subirlo a la nube.
- [ ] **Enlace al Espacio:** Tras subirlo, se debe obtener el `downloadURL` y guardarlo en el documento de la base de datos correspondiente a ese "slot", para que luego aparezca mágicamente en la pestaña "Materiales" del Dashboard del Admin y pueda descargarse en el ZIP.

## 3. Notificaciones por Email (Automáticas)
- [ ] **Correos al Cliente:** Integrar Sendgrid o la extensión nativa de Firebase "Trigger Email" (Nodemailer) para enviar un recibo elegante HTML al cliente apenas finalice su compra.
- [ ] **Correos al Administrador:** Enviar un correo de alerta ("Tienes un nuevo anunciante en el Slot X") a `admin@latroncal.com.ar` cuando ocurra una compra o se suba un nuevo diseño.

## 4. Mejoras de Uso (QoL)
- [ ] **Transición de Ediciones:** Crear un botón en el Panel de Administrador para "Archivar Edición y Crear Nueva". Esto vaciaría todos los espacios actuales, pero guardaría los diseños de la revista pasada en el historial.
- [ ] **Roles Extras:** Si la revista tiene diseñadores gráficos, permitir la creación de cuentas de "Diseñador", quienes al entrar al `/admin` solo puedan ver y descargar los "Materiales", pero que no tengan permiso para ver la sección de "Precios" ni "Clientes".
