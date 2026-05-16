# 📦 Importaciones — Guía completa de configuración

---

## 🗂️ Estructura de archivos

```
Importaciones/
├── index.html          ← Página principal
├── style.css           ← Estilos
├── app.js              ← Lógica + Supabase
├── images/
│   ├── logo.svg        ← Tu logo (recomendado)
│   └── logo.png        ← Alternativa
└── README.md           ← Este archivo
```

---

## 🖼️ Dónde colocar tu logo

Crea una carpeta `images/` dentro del proyecto y pon ahí tu logo.

**Formato recomendado:** SVG (se ve nítido en cualquier tamaño).
El PNG funciona igual si no tienes SVG.

El logo aparece en **dos lugares** del código:

### 1. Header (esquina superior izquierda)
```html
<!-- En index.html, línea ~20 -->
<img src="images/logo.svg" alt="Logo" class="company-logo" id="headerLogo">
```
- Si tu archivo se llama diferente, cambia `logo.svg` por el nombre real.
- Si usas PNG: `<img src="images/logo.png" ...>`
- Ya tiene `filter: brightness(0) invert(1)` en CSS → lo fuerza a blanco.
  Si tu logo **ya es blanco** en el SVG/PNG, quita esa línea en `style.css` (busca `.company-logo`).

### 2. Spinner giratorio al cargar
```html
<!-- En index.html, línea ~55 -->
<img src="images/logo.svg" alt="Logo animado" class="logo-spinner" id="spinnerLogo">
```
- Mismo archivo, da la vuelta una vez al cargar y luego desaparece.

---

## 🪐 Configurar Supabase (base de datos en la nube)

Supabase es gratuito y guarda los datos para todos los que abran el enlace.

### Paso 1 — Crear cuenta y proyecto

1. Ve a **https://supabase.com** y crea una cuenta gratuita.
2. Haz clic en **"New project"**.
3. Ponle un nombre (ejemplo: `importaciones`), elige una región (selecciona la más cercana, como `South America`), y crea una contraseña para la base de datos (guárdala, aunque no la necesitarás seguido).
4. Espera ~1 minuto a que el proyecto se inicialice.

### Paso 2 — Obtener tus credenciales

1. En el panel de tu proyecto, ve al menú izquierdo: **Project Settings → API**.
2. Copia dos valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → una cadena larga que empieza con `eyJ...`

3. Pega esos valores en `app.js`:
```javascript
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';   // <- reemplazar aquí
const SUPABASE_ANON_KEY = 'eyJhbGci...TU_CLAVE...';       // <- reemplazar aquí
```

### Paso 3 — Crear las tablas en Supabase

Ve a **SQL Editor** en el menú izquierdo y ejecuta este bloque completo:

```sql
-- Tabla de pendientes
create table pendientes (
  id bigint generated always as identity primary key,
  texto text not null,
  created_at timestamptz default now()
);

-- Tabla de contactos
create table contactos (
  id bigint generated always as identity primary key,
  nombre text not null,
  numero text not null
);

-- Tabla de trackings
create table trackings (
  id bigint generated always as identity primary key,
  icono text,
  label text not null,
  url text not null,
  created_at timestamptz default now()
);

-- Tabla de cards dinámicas (nuevos enlaces que agregas)
create table cards (
  id bigint generated always as identity primary key,
  title text not null,
  desc text,
  url text not null,
  color text default 'purple',
  created_at timestamptz default now()
);
```

Haz clic en **Run** (o Ctrl+Enter). Deberías ver "Success" para cada tabla.

### Paso 4 — Activar acceso público (Row Level Security)

Por defecto Supabase bloquea todo acceso. Necesitas permitir lectura y escritura:

Ve a **Authentication → Policies** (o en el menú: **Table Editor → cada tabla → RLS**).

La forma más rápida es ejecutar este SQL en el editor:

```sql
-- Permitir todo a usuarios anónimos (sin login)
-- Hazlo para cada tabla:

alter table pendientes enable row level security;
create policy "Acceso público pendientes" on pendientes for all using (true) with check (true);

alter table contactos enable row level security;
create policy "Acceso público contactos" on contactos for all using (true) with check (true);

alter table trackings enable row level security;
create policy "Acceso público trackings" on trackings for all using (true) with check (true);

alter table cards enable row level security;
create policy "Acceso público cards" on cards for all using (true) with check (true);
```

> ⚠️ **Nota de seguridad:** Esto permite que cualquiera con el link pueda leer y escribir datos. Para una aplicación interna del área de importaciones esto es aceptable. Si en el futuro quieres restringir quién puede borrar o agregar, puedes agregar autenticación de Supabase.

---

## 📤 Subir a GitHub Pages (detallado para VSC)

### Paso 1 — Instalar Git (si no lo tienes)

1. Ve a **https://git-scm.com/download/win** y descarga el instalador.
2. Instala con todas las opciones por defecto.
3. Abre una terminal en VSC: menú **Terminal → New Terminal**.

### Paso 2 — Configurar Git con tu nombre

Solo la primera vez:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 3 — Crear el repositorio en GitHub

1. Ve a **https://github.com** y entra con tu cuenta.
2. Haz clic en **"New repository"** (botón verde o el `+` arriba a la derecha).
3. Nombre: `Importaciones` (exactamente como el que ya tienes).
4. Márcalo como **Public**.
5. **No** marques "Initialize with README".
6. Haz clic en **Create repository**.

> Si ya tienes el repo `rdrg7/Importaciones`, simplemente trabaja sobre ese mismo repositorio.

### Paso 4 — Conectar tu carpeta local con GitHub

En la terminal de VSC, navega a tu carpeta del proyecto:

```bash
cd ruta/a/tu/carpeta/Importaciones
```

Luego ejecuta:

```bash
git init
git add .
git commit -m "Rediseño espacial con Supabase"
git branch -M main
git remote add origin https://github.com/rdrg7/Importaciones.git
git push -u origin main
```

> Si te pide autenticación, GitHub te pedirá tu usuario y un **token personal** (ya no acepta contraseñas). Para crear el token: GitHub → Settings → Developer Settings → Personal access tokens → Generate new token → marca "repo" → genera → cópialo y úsalo como contraseña.

### Paso 5 — Activar GitHub Pages

1. Ve a tu repositorio en GitHub.
2. Haz clic en **Settings** (arriba a la derecha del repo).
3. En el menú izquierdo: **Pages**.
4. Bajo "Branch", selecciona **main** y carpeta **/ (root)**.
5. Haz clic en **Save**.
6. En ~1 minuto, tu sitio estará en: `https://rdrg7.github.io/Importaciones/`

### Paso 6 — Subir cambios futuros

Cada vez que modifiques algo en VSC:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

GitHub Pages se actualiza automáticamente en ~30 segundos.

---

## 🎯 Resumen de uso de las pestañas

| Pestaña | Qué hace |
|---|---|
| **Pendientes** | Escribe una tarea → Enter o clic en `+`. Toca el punto rosa para borrarla. |
| **Contactos** | Escribe nombre y número → clic en `+`. La X borra el contacto. |
| **Trackings** | Escribe la clase de Font Awesome (ej. `fa-brands fa-fedex`), el nombre y la URL. |

### Ejemplo de íconos para Trackings:
```
fa-brands fa-fedex         → FedEx
fa-brands fa-ups           → UPS
fa-brands fa-dhl           → DHL (puede no estar disponible en FA gratuito)
fa-solid fa-ship           → Barco genérico
fa-solid fa-plane          → Avión genérico
fa-solid fa-truck          → Camión genérico
fa-solid fa-box            → Caja genérica
fa-solid fa-satellite-dish → Satélite
```

---

## 🔧 Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Título del sitio | `index.html` → `<span class="site-title">` |
| Descripción del área | `index.html` → `<p class="section-desc">` |
| Colores de los recuadros | `style.css` → variables `:root` |
| Velocidad de estrellas fugaces | `app.js` → `setInterval(spawnShootingStar, 2200)` (número en ms) |
| Duración del logo giratorio | `style.css` → `animation: spinLogo 1.8s` y `animation: fadeOutLogo 0.5s ease 2.4s` |

---

¿Dudas? Puedes preguntarme directamente en el chat.
