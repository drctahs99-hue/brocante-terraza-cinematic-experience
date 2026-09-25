# Ajustes de calendario y recorrido cinematográfico

## Objetivo
Actualizar la disponibilidad y la reserva, y convertir el recorrido de 480 cuadros en una experiencia precargada, fluida e inmersiva.

## Cambios
- Calcular siempre los tres meses visibles desde la fecha local actual y evitar diferencias entre la primera carga y el navegador.
- Abrir inmediatamente el panel lateral al elegir cualquier fecha disponible, conservando esa fecha en el formulario.
- Hacer que todo el contenido del panel de reserva tenga desplazamiento vertical cómodo en escritorio y móvil.
- Mostrar la fotografía inicial existente mientras se precargan los 480 cuadros.
- Bloquear temporalmente el desplazamiento de la página durante la carga y mostrar un texto cuyo relleno pasa de blanco a oro según el porcentaje completado, sin barra.
- Precargar una sola vez los 480 cuadros, conservarlos en memoria y dibujar únicamente el cuadro más reciente solicitado mediante `requestAnimationFrame`, siempre entre 0 y 479.
- Situar « L'Art de Recevoir » en el centro y revelar los otros textos aproximadamente al 33 %, 66 % y 90 % del recorrido, calculados respecto al progreso total.
- Sustituir el texto inferior del recorrido por un gran botón transparente y dorado de « Agendar una cita » al final.
- Añadir revelados 3D inmersivos con Motion a los textos y bloques principales, respetando la preferencia de movimiento reducido.
- Hacer que los textos no dorados transicionen gradualmente a oro al pasar el cursor, sin alterar los textos que ya usan el acento dorado.

## Validación
- Comprobar carga completa, recorrido rápido, límites del cuadro, calendario, apertura y desplazamiento del formulario.
- Revisar el resultado en escritorio y móvil, con y sin reducción de movimiento.
