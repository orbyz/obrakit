# ObraKit — Commercial Strategy Sync

> Documento puente entre Estrategia Comercial y Desarrollo.
>
> La estrategia comercial define qué debe ser ObraKit.
> Desarrollo implementa técnicamente las decisiones aprobadas.

---

## 1. Estado

**Estado:** En definición
**Última actualización:** 2026-08-22

---

## 2. Regla de trabajo

Este documento es la fuente de verdad para las decisiones comerciales
que tengan impacto directo en el desarrollo de ObraKit.

El chat de Estrategia Comercial es responsable de analizar y decidir.

El chat de Desarrollo es responsable de implementar las decisiones
aprobadas.

Desarrollo no debe inventar, reinterpretar ni cerrar decisiones
comerciales pendientes.

---

# 3. Estrategia Comercial

## 3.1 Naming de planes

**Estado:** Pendiente

Planes comerciales previstos:

- Starter
- Pro
- Business

### Decisión final

Pendiente de definición en Estrategia Comercial.

---

## 3.2 Pricing

**Estado:** Pendiente

### Precio mensual

Pendiente.

### Precio anual

Pendiente.

### Condiciones especiales

Pendiente.

---

## 3.3 Founding Partners

**Estado:** Concepto aprobado — definición pendiente

ObraKit podrá disponer de un programa especial para determinados
primeros clientes o colaboradores estratégicos.

No se considera un plan comercial público.

### Primer posible caso

AVE BUILDERS.

### Condiciones

Pendientes de definir en Estrategia Comercial.

---

## 3.4 Oferta primeros 100 clientes

**Estado:** Pendiente

Pendiente definir:

- precio
- duración
- condiciones
- número máximo
- relación con Founding Partners
- si el beneficio es permanente
- comunicación comercial

---

## 3.5 Funcionalidades por plan

**Estado:** Pendiente

| Funcionalidad | Starter | Pro | Business |
|---|---|---|---|
| Pendiente | — | — | — |

No implementar restricciones comerciales hasta que esta matriz
sea aprobada.

---

## 3.6 Posicionamiento

**Estado:** Pendiente

Pendiente de definición en Estrategia Comercial.

---

## 3.7 Propuesta de valor

**Estado:** Pendiente

Pendiente de definición en Estrategia Comercial.

---

## 3.8 Adquisición y conversión

**Estado:** Pendiente

Pendiente de definición en Estrategia Comercial.

---

## 3.9 Marketing y ventas

**Estado:** Pendiente

Pendiente de definición en Estrategia Comercial.

---

# 4. Impacto en Desarrollo

Una vez aprobada la estrategia comercial, Desarrollo deberá traducirla
a:

1. Modelo de planes.
2. Suscripciones.
3. Estados de suscripción.
4. Reglas de acceso.
5. Límites por plan.
6. Feature gating.
7. UI de billing.
8. Página de pricing.
9. Onboarding.
10. Gestión de upgrades/downgrades.
11. Programa Founding Partner.
12. Integración de pagos, cuando corresponda.

---

# 5. Estado técnico actual

## Subscription System

Actualmente existe una implementación técnica inicial:

- `plans`
- `subscriptions`
- relación `tenant → subscription → plan`
- RLS
- contexto de tenant
- capa de acceso a suscripción

### Importante

El plan `free` existente actualmente es **provisional**.

No representa el pricing comercial definitivo de ObraKit.

Fue creado como plan técnico de compatibilidad para los tenants
existentes durante la introducción del sistema de suscripciones.

No debe interpretarse como decisión comercial.

---

# 6. Desarrollo — siguiente decisión pendiente

Desarrollo queda detenido respecto a la definición comercial de planes
hasta recibir la decisión aprobada desde Estrategia Comercial.

No se deben implementar todavía:

- Starter
- Pro
- Business
- Founding Partner
- precios
- límites por plan
- restricciones de funcionalidades

hasta que estén definidos en este documento.

---

# 7. Flujo entre chats

## Estrategia Comercial

Analiza → debate → decide → actualiza este documento.

## Desarrollo

Lee decisiones aprobadas → audita implementación existente →
adapta únicamente lo necesario → prueba → commit → push →
verifica migraciones.

---

# 8. Historial de decisiones

| Fecha | Decisión | Área | Estado |
|---|---|---|---|
| 2026-08-21 | Crear sistema técnico de suscripciones | Desarrollo | Implementado |
| 2026-08-22 | `free` no representa el pricing comercial definitivo | Producto | Aprobado |
| 2026-08-22 | Modelos comerciales previstos: Starter / Pro / Business | Estrategia | Pendiente de definición |
| 2026-08-22 | Founding Partner será tratado como programa especial, no como plan público | Estrategia | Concepto aprobado |

---

# 9. Regla fundamental

> **No desarrollar una decisión comercial que todavía no haya sido decidida.**

La estrategia puede tardar lo necesario en definir el modelo.

Desarrollo no debe adelantarse creando restricciones, precios o
planes basados en suposiciones.
