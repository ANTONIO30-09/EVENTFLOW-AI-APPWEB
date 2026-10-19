# 🎉 EventFlow AI - Admin Panel (Web)

> **Plataforma web de gestión logística para eventos de alta gama.**  
> Panel de administración desarrollado en Next.js para complementar la aplicación móvil de EventFlow AI.

---

## 📋 Tabla de Contenidos

1. [Sobre el Proyecto](#-sobre-el-proyecto)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Sistema de Diseño](#-sistema-de-diseño)
4. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
5. [Características Actuales](#-características-actuales)
6. [Instalación y Configuración](#-instalación-y-configuración)
7. [Despliegue](#-despliegue)
8. [Roadmap](#-roadmap)

---

## 🎯 Sobre el Proyecto

**EventFlow AI Admin** es la interfaz web diseñada para los organizadores de eventos. A diferencia de la aplicación móvil (Flutter) destinada al personal de campo y check-in, esta plataforma web está pensada para la administración centralizada: creación de eventos, gestión de inventario global, generación de códigos QR y configuración de la distribución de mesas con Inteligencia Artificial.

El proyecto está diseñado bajo una **arquitectura desacoplada**, conectándose al mismo backend de Firebase (Firestore + Auth) que la aplicación móvil.

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Backend:** Firebase (Firestore, Authentication)

---

## 🎨 Sistema de Diseño

La identidad visual se mantiene sincronizada con la app móvil para ofrecer una experiencia de marca unificada.

| Color | Hex | Uso |
|-------|-----|-----|
| **Azul Noche** | #0d131f (Fondo custom) | Fondo principal y superposiciones |
| **Porcelana** | #FBF9F4 | Textos principales y superficies claras |
| **Oro / Bronce** | #B8863E / #FFD700 | Acentos, botones, iluminación neón |
| **Verde Salvia** | #3E7A5C | Estados de éxito (Check-in aprobado) |

- **Tipografías:** Playfair Display (títulos editoriales), Great Vibes (caligrafía de lujo), Inter (textos de interfaz).
- **Efectos Visuales:** Glassmorphism (tarjetas translúcidas), animaciones de luces Bokeh, partículas doradas constantes y texto neón con gradientes radiales.

---

## 🏗️ Arquitectura del Proyecto

El proyecto implementa una **Arquitectura Basada en Características (Feature-Based Architecture)**, ideal para escalar a futuro:

src/
├── app/                      # Enrutamiento y páginas (Next.js App Router)
│   ├── (auth)/login/         # Pantallas de autenticación (Público)
│   ├── (dashboard)/          # Panel de administración (Privado)
│   └── page.tsx              # Landing Page (Pública)
├── features/                 # Módulos de lógica de negocio (Dominios)
│   ├── auth/                 # Lógica y componentes de sesión
│   ├── events/               # CRUD de eventos
│   ├── users/                # Gestión de staff y organizadores
│   ├── inventory/            # Generación y escaneo de QR
│   └── ai-seating/           # Configuración de distribución con IA
├── shared/                   # Código compartido
│   ├── components/ui/        # Componentes genéricos (Botones, Modales)
│   ├── components/layout/    # Sidebar, Topbar
│   └── lib/                  # Configuración de Firebase (firebase.ts)
└── assets/                   # Imágenes y recursos locales

---

## ✨ Características Actuales (Fase 1 - Landing)

- **Hero Cinemático:** Video de fondo en bucle (CHAMPAG.mp4), texto caligráfico en neón dorado con animación de trazo (Clip-path), y partículas doradas cayendo.
- **Storytelling Dinámico:** Sección que alterna frases inspiracionales automáticamente, sobre un fondo oscuro con luces Bokeh en constante movimiento (tonos oro/blanco).
- **Slider de Presentación:** Carrusel de imágenes de alta calidad (Bodas, Quinceañeros, Eventos Corporativos) con transiciones suaves y adaptabilidad móvil.
- **Navbar Transparente:** Barra de navegación minimalista con botones directos para "Iniciar Sesión" y "Registrarse".

---

## 🚀 Instalación y Configuración

1. **Clonar el repositorio:**
git clone https://github.com/ANTONIO30-09/EVENTFLOW-AI-APPWEB.git
cd EVENTFLOW-AI-APPWEB

2. **Instalar dependencias:**
npm install

3. **Variables de Entorno:**
Crea un archivo .env.local en la raíz del proyecto y agrega las credenciales de tu proyecto de Firebase:
NEXT_PUBLIC_FIREBASE_API_KEY="tu_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="tu_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="tu_app_id"

4. **Ejecutar el servidor de desarrollo:**
npm run dev

Abre http://localhost:3000 en tu navegador.

---

## 🌐 Despliegue

Para generar la versión de producción y subirla a Firebase Hosting (o Vercel):

npm run build
firebase deploy --only hosting:admin

---

## 🗺️ Roadmap (Próximas fases)

- [ ] **Autenticación Real:** Conectar la pantalla de Login con Firebase Auth y validar el rol organizador.
- [ ] **Dashboard del Administrador:** Crear el layout con Sidebar y métricas en tiempo real.
- [ ] **Gestión de Eventos:** Formulario para crear eventos y generar códigos QR para el mobiliario.
- [ ] **Integración con IA:** Interfaz web para configurar las reglas y lanzar la generación de mesas desde la nube.

---

## ✒️ Autor

**ANTONIO30-09** - https://github.com/ANTONIO30-09

> Proyecto desarrollado para la Universidad Privada Franz Tamayo (Unifranz) - Cochabamba, Bolivia.
