# 🏗️ ObraKit

**Gestión inteligente para autónomos de reformas**

ObraKit es un MicroSaaS diseñado para ayudar a profesionales del sector de reformas a gestionar sus obras, controlar gastos de materiales y entender qué trabajos generan más rentabilidad.

---

## 🎯 Problema que resuelve

Los autónomos de reformas pierden dinero porque:
- No registran los gastos de materiales a tiempo
- No saben qué tipo de obra les da más margen
- Gestionan leads de forma caótica (WhatsApp, papeles, Excel)

**ObraKit centraliza todo en una herramienta simple.**

---

## ✨ Funcionalidades

### 🏗️ Gestión de Obras
- Kanban visual con 3 estados: Nuevo → En Curso → Cerrado
- Formulario rápido: nombre, teléfono, email, dirección
- Integración con Google Maps para navegación a obra
- Alertas de tiempo estimado y extensión de plazo

### 🧱 Control de Gastos
- Registro rápido de materiales por obra
- Categorización automática (cerámica, fontanería, pintura...)
- Vista por obra y por categoría
- Integración con obras del pipeline

### 📊 Dashboard de Rentabilidad
- Margen real por obra (facturado - gastado)
- Análisis por tipo de obra (baño, cocina, integral...)
- Porcentaje de margen y alertas visuales
- Insights automáticos sobre qué trabajos dan más dinero

### 👤 Multitenancy
- Cada autónomo tiene su propio espacio aislado
- Datos completamente separados entre clientes
- Posibilidad de añadir miembros del equipo (futuro)

---

## 🛠️ Stack Técnico

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v3

**Backend:**
- Supabase (PostgreSQL + Auth + RLS)
- Server Actions de Next.js
- Row Level Security para multitenancy

**Infraestructura:**
- Turborepo (monorepo)
- pnpm
- Git flow: feature → dev → main
- Deploy: Vercel

---

## 🚀 Instalación Local

### Requisitos previos
- Node.js 20+
- pnpm 8+
- Cuenta de Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/obrakit.git
cd obrakit
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea `apps/leads-web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 4. Ejecutar migraciones SQL

Ve a tu proyecto Supabase → SQL Editor y ejecuta en orden:
1. Schema inicial (tenants, profiles, leads, gastos, seguimientos)
2. Políticas RLS
3. Triggers

### 5. Arrancar el servidor de desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
obrakit/
├── apps/
│   └── leads-web/              # App principal Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/     # Login y registro
│       │   │   ├── (dashboard)/ # Obras, materiales, rentabilidad
│       │   │   └── actions/    # Server Actions
│       │   ├── components/
│       │   │   ├── leads/
│       │   │   ├── gastos/
│       │   │   └── rentabilidad/
│       │   ├── lib/
│       │   │   └── supabase/
│       │   └── types/
│       └── public/
├── packages/                   # Shared code (futuro)
└── supabase/                   # Migraciones y seed
```

---

## 🗄️ Schema de Base de Datos

**Tablas principales:**
- `tenants` - Negocios de autónomos
- `tenant_members` - Miembros con acceso
- `profiles` - Datos de usuario
- `leads` - Obras/proyectos
- `seguimientos` - Historial de contacto por obra
- `gastos` - Gastos de materiales

**Multitenancy:**
- Row Level Security (RLS) en todas las tablas
- Función `get_my_tenants()` para filtrado automático
- Aislamiento completo entre clientes

---

## 🔐 Seguridad

- Autenticación vía Supabase Auth
- Row Level Security (RLS) en todas las queries
- Service role key solo en Server Actions
- Variables de entorno separadas dev/prod
- HTTPS obligatorio en producción

---

## 📈 Roadmap

### ✅ MVP Completado (v1.0)
- Auth + multitenancy
- Gestión de obras
- Control de gastos
- Dashboard rentabilidad

### 🔜 Próximas versiones
- [ ] App móvil (React Native / Expo)
- [ ] OCR de tickets de compra
- [ ] Gestión de empleados
- [ ] Calendario de obras
- [ ] Exportación a PDF/Excel
- [ ] Integración con WhatsApp Business

---

## 🤝 Contribuir

Este es un proyecto privado en desarrollo activo. Si tienes feedback o sugerencias, contacta con [info@orbyzstudio.dev](mailto:info@orbyzstudio.dev).

---

## 📄 Licencia

Propietario - Todos los derechos reservados © 2026 ObraKit

---

## 👨‍💻 Autor

Desarrollado por **OrByZ Studio** - Enfocado en resolver problemas reales de autónomos del sector reformas.

---

## 📞 Soporte

- Email: info@obrakit.com
- Web: https://obrakit.vercel.app
