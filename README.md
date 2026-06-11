<div align="center">
  <img src="./public/logo.webp" alt="Sosa Impor Logo" width="250" />
  <h1>🛒 E-Commerce Sosa Impor - Frontend</h1>
  <p><em>Plataforma moderna de comercio electrónico desarrollada con Next.js y Tailwind CSS.</em></p>
</div>

---

## 🚀 Cómo descargar y ejecutar el proyecto en local

### 1️⃣ Clonar el repositorio
Para descargar el proyecto a tu máquina local, abre tu terminal y ejecuta:

```bash
git clone <url_del_repositorio>
cd ecommerce-sosaimpor-frontend
```

### 2️⃣ Instalar dependencias
Este proyecto utiliza `pnpm` como gestor de paquetes. Ejecuta el siguiente comando en la raíz del proyecto:

```bash
pnpm install
```
*(Si no tienes pnpm, puedes instalarlo globalmente con `npm install -g pnpm`)*

### 3️⃣ Ejecutar en modo desarrollo
Inicia el servidor de desarrollo en modo local:

```bash
pnpm dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000) o en la red local según se indique en la consola.

---

## 📚 Librerías principales utilizadas

| Librería | Descripción |
| :--- | :--- |
| ⚛️ **Next.js** (`next`) | Framework principal de React para App Router, renderizado del lado del servidor (SSR) y optimización de rutas. |
| ⚛️ **React** (`react`) | Biblioteca central para construir interfaces de usuario interactivas basadas en componentes. |
| 🎨 **Tailwind CSS** | Framework de CSS *utility-first* (versión 4) para crear diseños modernos, responsivos y altamente personalizados rápidamente. |
| 🌙 **Next Themes** | Herramienta para gestionar los temas de color (Modo Claro / Modo Oscuro) y prevenir parpadeos al cargar la página. |
| 🖼️ **Lucide React** | Biblioteca de iconos vectoriales limpios, consistentes y ligeros. |
| 🟦 **TypeScript** | Superconjunto de JavaScript que añade tipado estático para prevenir errores y mejorar la experiencia de desarrollo. |

---

## 📱 Modo Móvil vs 💻 Modo Escritorio

Este proyecto adopta una arquitectura orientada a la **experiencia específica por dispositivo**, separando los componentes de interfaz en tres grandes categorías para maximizar la usabilidad:

*   **📱 Modo Móvil (`components/movil/`):** Diseñado específicamente para pantallas pequeñas y navegación táctil. Incluye navegación inferior (`MobileBottomNav`), carruseles horizontales (`MobileCategoryCarousel`), y cajones de filtros deslizables (`MobileFilterDrawer`) para optimizar el espacio vertical.
*   **💻 Modo Escritorio (`components/escritorio/`):** Aprovecha todo el ancho de las pantallas grandes. Presenta una cabecera completa (`DesktopHeader`), amplias cuadrículas de productos (`DesktopProductGrid`), y barras laterales fijas para navegación por categorías y filtros.
*   **🧩 Compartidos (`components/compartidos/`):** Elementos base de UI (botones, inputs, modales, items de carrito) que mantienen la consistencia visual de la marca y se adaptan a ambos entornos.

---

## 📂 Estructura del Proyecto

El proyecto está organizado siguiendo principios de diseño por características (*Feature-Sliced Design*), manteniendo separada la lógica de negocio de la interfaz visual:

```text
ecommerce-sosaimpor-frontend/
├── app/                  # Enrutador de Next.js. Contiene las páginas web y layouts principales.
├── components/           # Componentes visuales de la interfaz de usuario.
│   ├── compartidos/      # Componentes UI reusables (layout, productos, ui base).
│   ├── escritorio/       # Componentes exclusivos para la vista Desktop.
│   └── movil/            # Componentes exclusivos para la vista Mobile.
├── documentacion/        # Guías técnicas, reglas de diseño y documentación arquitectónica.
├── features/             # Lógica de negocio encapsulada por dominios.
│   ├── cart/             # Estado (stores) y tipos del carrito de compras.
│   ├── home/             # Hooks, APIs y tipos de la página de inicio.
│   ├── products/         # Manejo del catálogo, filtros, adaptadores de datos y búsqueda.
│   └── ...
├── lib/                  # Configuración de clientes (ej. Axios) y utilidades misceláneas.
├── providers/            # Proveedores de contexto globales (ej. ThemeProvider).
└── public/               # Recursos estáticos como el logo (logo.webp), imágenes y SVGs.
```
