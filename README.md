# ÁUREA | Consultoría Inmobiliaria & Desarrollos

Sitio web profesional de alta gama para agente y desarrollador inmobiliario, diseñado bajo estándares **Frontend Senior** y lineamientos de portales inmobiliarios de lujo internacional (*The Agency, Compass, Sotheby's International Realty, Engel & Völkers*).

---

## 🏛️ Características Principales

1. **Diseño Visual Anti-"AI Slop" & Jerarquía Editorial:**
   - Tipografía refinada (`Playfair Display` serif para títulos con personalidad, combinada con `Plus Jakarta Sans` para lectura técnica y números).
   - Paleta sobria contemporánea (marfil, grafito profundo, detalles en bronce/oro cálido mate `#B58E55`). Cero gradientes artificiales o clichés.
   - Fotografía arquitectónica en alta definición y optimizada con Next.js Image.

2. **Catálogo & Motor de Búsqueda Interactiva (`/propiedades`):**
   - Búsqueda textual predictiva en tiempo real (por título, barrio, dirección, código).
   - Filtros dinámicos por **Operación** (Venta, Alquiler, Preventa en Pozo), **Tipo de Inmueble** (Casas, Departamentos, Loteos, Comerciales, Desarrollos), **Rango de Precios (USD)**, **Dormitorios** y **Estado**.
   - Ordenamiento por destacados, más recientes, menor o mayor precio.
   - Alternancia entre vista en cuadrícula (grid) y vista lista.
   - Ficha técnica completa con galería de imágenes en alta resolución, amenities y **calculadora de cuota hipotecaria integrada por propiedad**.

3. **Sección Destacada Dinámica (Home Hero & Oportunidades):**
   - Banners dinámicos con badges comerciales ("Preventa Pozo", "Loteo Campestre", "Oportunidad Retasada") que pueden actualizarse al instante desde el CMS según la estrategia de ventas del momento.

4. **Marca Personal & Despacho (`/sobre-mi`):**
   - Sección de trayectoria institucional del consultor/agente con fotografía profesional.
   - Métricas y track record auditado (+12 años, +USD 48M transaccionados, +195 operaciones concluidas).
   - 4 pilares de metodología: *Tasación de Precisión, Estructuración Financiera, Marketing Audiovisual y Confidencialidad Jurídica*.
   - Testimonios reales de inversores y desarrolladores.

5. **Módulo Financiero & Hipotecario UVA (`/financiamiento`):**
   - **Simulador Hipotecario Interactivo:** cálculo en tiempo real de cuota mensual, ingresos netos familiares demostrables requeridos (relación cuota-ingreso 25%), monto total financiado y plazo en años.
   - **Comparador de Tasas Bancarias Actualizadas:** tabla comparativa con las tasas UVA de entidades líderes (*Banco Nación, Banco Galicia, Santander, BBVA, Banco Ciudad, Banco Hipotecario*).
   - Guía paso a paso en 4 etapas para comprar un inmueble con crédito hipotecario.

6. **Panel de Gestión de Contenidos / CMS Modular (`/admin`):**
   - Acceso seguro mediante clave de gestión (`aurea2026` o `admin`).
   - Gestión integral sin tocar código:
     - **Propiedades:** crear, editar precios, descripciones, fotos, alternar destacado o estado de oportunidad.
     - **Banners:** activar, desactivar o modificar campañas comerciales.
     - **Tasas Bancarias:** actualizar TNA, CFT, financiamiento máximo y requisitos de cada banco.
     - **Perfil del Agente:** cambiar teléfono de WhatsApp, foto, matrícula, biografía y redes.
     - **Respaldos:** exportar toda la base a JSON o restablecer valores por defecto.

---

## 🚀 Puesta en Marcha

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

Para compilar para producción:

```bash
npm run build
npm run start
```
