# Hangarsud · propuesta de web y panel

Propuesta de diseño (demo) para la escuela de vuelo Hangar Sud, Córdoba, Argentina. No es el sitio oficial.

- `index.html` · landing (video en loop, calculadora de plan, vouchers, reserva)
- `panel.html` · panel de gestión (consultas, reservas, automatizaciones). Código de acceso demo en `app.js` (`CFG.pass`)
- `app.js` · configuración y datos de ejemplo (precios, WhatsApp, vouchers, flota). Los precios están en `null` ("Consultar")
- `landing.css` / `styles.css` · estilos de la landing y del panel
- `fotos/`, `video/` · material de ejemplo (Unsplash y Pexels, uso libre). Reemplazar por fotos y video propios

## Ver en local
```bash
python3 -m http.server 8123
# abrir http://localhost:8123/index.html
```

## Pendiente para producción
Base de datos real y login, WhatsApp/email automáticos (n8n o Make), Mercado Pago, Google Analytics y Meta Pixel (IDs en `app.js`), revisión legal del texto de privacidad.
