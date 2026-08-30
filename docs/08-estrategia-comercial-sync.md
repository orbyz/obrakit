# ObraKit — Estrategia Comercial Sync
## Fuente de verdad para Pricing, Packaging y Suscripciones

**Estado:** aprobado para trasladar a Desarrollo
**Fecha:** 30 de agosto de 2026
**Ámbito:** estrategia comercial, monetización y reglas de packaging.
**No contiene:** decisiones de implementación técnica.

> Este documento debe ser tratado como la fuente de verdad comercial. Desarrollo debe comparar la implementación existente contra estas decisiones antes de modificar `plans`, `subscriptions`, access layer, trial o billing.

---

# 1. Clasificación de la información

- **[REAL]** Hecho verificado.
- **[DECISIÓN]** Decisión comercial aprobada.
- **[HIPÓTESIS]** Suposición todavía pendiente de validación.
- **[RECOMENDACIÓN]** Propuesta estratégica.
- **[DATOS A VALIDAR]** Información todavía no demostrada.

Una hipótesis no se convierte en decisión por repetición.

---

# 2. Contexto comercial

## [REAL]

ObraKit es un SaaS para autónomos, profesionales independientes, microempresas y pequeñas empresas de reformas/construcción.

El flujo de valor es:

**Cliente → oportunidad → obra → equipo → horas → materiales → gastos → costes → rentabilidad**

La tesis comercial sigue siendo que ObraKit no debe venderse simplemente como "otro gestor de obras", sino como una herramienta sencilla para controlar económicamente las reformas.

Problema económico central:

> **El profesional sabe cuánto vende una obra, pero no necesariamente cuánto dinero gana realmente con ella ni detecta a tiempo cuándo el margen se está deteriorando.**

---

# 3. Pricing aprobado

## [DECISIÓN] Starter

**29,99 €/mes**

## [DECISIÓN] Pro

**59,99 €/mes**

## [DECISIÓN] Business

**99,99 €/mes**

## [DECISIÓN] Anual

Se pagan **10 meses** y se obtienen **12 meses de servicio**.

Equivalencias:

- Starter: **299,90 €/año**
- Pro: **599,90 €/año**
- Business: **999,90 €/año**

Equivale aproximadamente a un **16,67 % de descuento efectivo** frente a 12 mensualidades.

## [DECISIÓN] Founder

Los **primeros 50 clientes** obtienen:

> **Starter por 19,99 €/mes para siempre.**

Founder:

- hereda las capacidades y límites de Starter;
- es una condición comercial especial;
- no es un cuarto plan funcional;
- está limitado a los primeros 50 clientes.

### Founder y anual

**[DECISIÓN]** El precio Founder de 19,99 €/mes es una oferta mensual especial. El descuento anual de 10 meses por 12 no se acumula automáticamente con Founder. Cualquier oferta anual específica para Founder requerirá una decisión posterior.

---

# 4. Principio de packaging

## [DECISIÓN]

En la etapa actual **no se deben crear diferencias artificiales de funcionalidades entre planes**.

Todavía no existen suficientes funcionalidades avanzadas para justificar barreras como:

- automatizaciones;
- gestión avanzada de equipos;
- integraciones;
- workflows avanzados;
- IA avanzada;
- reporting avanzado;
- permisos avanzados;
- etc.

La diferenciación inicial será principalmente mediante:

1. **usuarios**;
2. **empleados**;
3. **obras activas**.

Principio:

> **El cliente paga más por tener mayor capacidad operativa, no porque escondamos funcionalidades básicas.**

---

# 5. Límites aprobados

| | Founder | Starter | Pro | Business |
|---|---:|---:|---:|---:|
| Precio mensual | **19,99 €** | **29,99 €** | **59,99 €** | **99,99 €** |
| Usuarios | 2 | 2 | 5 | 10 |
| Empleados | 5 | 5 | 15 | 30 |
| Obras activas | 3 | 3 | 10 | 25 |
| Funcionalidades base | Starter | Starter | Mismas | Mismas |

Founder hereda exactamente los límites de Starter.

---

# 6. Starter

**29,99 €/mes**

Para autónomos y pequeños negocios que comienzan a centralizar la gestión.

### Límites

- **2 usuarios**
- **5 empleados**
- **3 obras activas**

El plan debe ser suficientemente útil para operar un negocio pequeño de forma real.

---

# 7. Pro

**59,99 €/mes**

Para pequeñas empresas con equipo y varias obras simultáneas.

### Límites

- **5 usuarios**
- **15 empleados**
- **10 obras activas**

El salto Starter → Pro representa principalmente:

> **más capacidad para operar el negocio.**

No una colección artificial de funcionalidades bloqueadas.

---

# 8. Business

**99,99 €/mes**

Para empresas pequeñas ya estructuradas y con mayor volumen operativo.

### Límites

- **10 usuarios**
- **30 empleados**
- **25 obras activas**

Business representa capacidad superior para:

- más responsables;
- más empleados;
- más obras simultáneas.

No necesita todavía una separación artificial de funcionalidades.

---

# 9. Usuarios y empleados son conceptos diferentes

## [DECISIÓN]

### Usuario

Persona con una cuenta que puede iniciar sesión en ObraKit.

Ejemplos:

- propietario;
- administrador;
- responsable de operaciones;
- encargado;
- administrativo.

### Empleado

Persona registrada en la plantilla/equipo para:

- asignación a obras;
- worklogs;
- costes laborales;
- gestión interna.

Un empleado no necesita necesariamente ser usuario.

## Empleado que también es usuario

Si una persona es empleado y además tiene una cuenta de acceso:

- consume una plaza de **empleado**;
- consume una plaza de **usuario**.

Esto representa dos capacidades diferentes:

> capacidad de gestión de plantilla + capacidad de acceso a la plataforma.

No significa cobrar dos veces por esa persona.

---

# 10. Precio por negocio, no por trabajador

## [DECISIÓN]

En esta etapa no se cobrará individualmente por empleado.

El modelo es:

> **precio por negocio/cuenta + límites de capacidad.**

La hipótesis estratégica anterior de "precio por negocio, no por trabajador" se convierte ahora en decisión para esta etapa.

No se crearán todavía add-ons por empleado.

---

# 11. Obras: límite por obras ACTIVAS

## [DECISIÓN]

Los límites se aplican a:

> **obras activas**

No al número total histórico de obras.

### Límites

- Founder / Starter: **3**
- Pro: **10**
- Business: **25**

---

# 12. Qué es una obra activa

## [DECISIÓN COMERCIAL]

Una obra activa es una obra que forma parte actualmente de la cartera operativa y requiere seguimiento.

Una obra que ya no forma parte de la cartera operativa puede pasar al histórico/archivo y dejar de consumir una plaza activa.

La definición exacta de qué estado del producto representa "activa" deberá alinearse con el modelo existente de estados de obra, pero **no debe convertir el límite en un límite histórico de registros**.

---

# 13. Obras históricas

## [DECISIÓN]

El límite no restringe el histórico.

Una empresa puede acumular muchas obras a lo largo del tiempo.

El límite controla:

> **cuántas obras puede gestionar simultáneamente como cartera activa.**

No controla:

> cuántas obras ha tenido en toda su historia.

No se deben borrar obras para liberar capacidad.

---

# 14. Qué ocurre al alcanzar un límite

## [DECISIÓN]

El comportamiento es:

> **hard limit para nuevas altas, sin bloqueo de datos existentes.**

Cuando se alcanza un límite:

- se conservan todos los datos;
- se puede seguir trabajando con recursos existentes;
- se puede consultar el histórico;
- no se permite crear un nuevo recurso que supere el límite;
- se ofrece upgrade como alternativa.

### Ejemplo

Starter con:

**3/3 obras activas**

Puede seguir:

- editando obras;
- registrando worklogs;
- registrando gastos;
- registrando materiales;
- consultando rentabilidad.

Pero no puede crear/activar una cuarta obra.

Mensaje comercial conceptual:

> **Has alcanzado el límite de 3 obras activas de Starter. Actualiza a Pro para gestionar hasta 10 obras activas.**

---

# 15. Nunca destruir datos para cumplir un límite

## [DECISIÓN]

Al alcanzar o superar un límite nunca se debe:

- borrar datos;
- ocultar obras;
- eliminar empleados;
- eliminar usuarios;
- eliminar histórico;
- bloquear la consulta de datos existentes.

Los límites son de **capacidad**, no de conservación.

---

# 16. Downgrade

## [DECISIÓN]

Un downgrade no debe borrar automáticamente recursos existentes.

Ejemplo:

Pro:

- 5 usuarios;
- 15 empleados;
- 10 obras activas.

Downgrade a Starter:

- límite 2 usuarios;
- límite 5 empleados;
- límite 3 obras activas.

El cliente conserva sus datos aunque esté temporalmente por encima de los límites.

Se considera:

> **estado de exceso de capacidad.**

Mientras esté por encima:

- puede consultar y gestionar los recursos existentes;
- no puede crear nuevos recursos del tipo que exceda el límite;
- puede volver a subir de plan;
- o reducir voluntariamente el uso hasta entrar en el límite.

Nunca se debe eliminar información automáticamente para forzar el cumplimiento.

---

# 17. Límites por recurso

## Usuarios

Ejemplo Starter:

**2/2 usuarios**

Intentar añadir un tercero:

> bloqueado.

Alternativa:

> actualizar a Pro.

No habrá cobro automático por usuario adicional en esta etapa.

## Empleados

Ejemplo Starter:

**5/5 empleados**

Intentar añadir un sexto:

> bloqueado.

Alternativas:

- liberar capacidad cuando corresponda;
- actualizar a Pro.

No habrá add-on por empleado en esta etapa.

## Obras

Ejemplo Starter:

**3/3 obras activas**

Intentar activar una cuarta:

> bloqueado.

Alternativas:

- cerrar/archivar una obra cuando realmente corresponda;
- actualizar a Pro.

No se debe eliminar una obra simplemente para crear otra.

---

# 18. Por qué estos límites

La intención comercial no es crear límites molestos artificialmente.

Los límites deben representar el crecimiento natural de una empresa:

### Starter
2 usuarios / 5 empleados / 3 obras

Empresa pequeña.

### Pro
5 usuarios / 15 empleados / 10 obras

Empresa en crecimiento.

### Business
10 usuarios / 30 empleados / 25 obras

Empresa con mayor estructura y volumen operativo.

El salto de plan debe sentirse como:

> **"Mi negocio ha crecido y necesito más capacidad."**

No:

> **"Me están quitando funcionalidades."**

---

# 19. No añadir más límites todavía

## [DECISIÓN]

No limitar artificialmente en esta etapa:

- clientes;
- oportunidades CRM;
- materiales;
- gastos;
- worklogs;
- consumos;
- documentos;
- registros financieros;
- dashboard;
- rentabilidad.

Los tres ejes actuales son suficientes:

> **usuarios + empleados + obras activas**

Añadir más dimensiones aumentaría la complejidad del pricing sin suficiente justificación.

---

# 20. Diferenciación futura

## [DECISIÓN ESTRATÉGICA]

La diferenciación por funcionalidades aparecerá progresivamente cuando exista suficiente profundidad de producto.

### Etapa 1 — actual

**Capacidad:**

- usuarios;
- empleados;
- obras activas.

### Etapa 2 — producto más maduro

Podrán aparecer diferencias por:

- automatizaciones;
- permisos/roles avanzados;
- informes avanzados;
- integraciones;
- exportaciones avanzadas;
- planificación avanzada;
- funcionalidades móviles avanzadas;
- colaboración.

### Etapa 3 — producto maduro

Diferenciación por:

- capacidad;
- funcionalidades de alto valor;
- automatización;
- integraciones;
- analítica;
- soporte;
- capacidades empresariales.

Principio:

> **El cliente debe pagar más porque recibe o necesita más valor, no porque escondamos funcionalidades básicas.**

---

# 21. Evolución de los planes

Dirección estratégica:

**Starter**
→ negocio pequeño

**Pro**
→ negocio en crecimiento

**Business**
→ negocio con mayor equipo/volumen

**Enterprise / Custom**
→ necesidades específicas, volumen, integraciones y requisitos empresariales.

Enterprise no es prioridad para v1.0.0.

---

# 22. Validación de los límites

## [DATOS A VALIDAR]

Después del lanzamiento debemos medir:

- % de Starter que alcanza 2 usuarios;
- % de Starter que alcanza 5 empleados;
- % de Starter que alcanza 3 obras;
- % de Pro que alcanza 5 usuarios;
- % de Pro que alcanza 15 empleados;
- % de Pro que alcanza 10 obras;
- % de Business que alcanza 10 usuarios;
- % de Business que alcanza 30 empleados;
- % de Business que alcanza 25 obras;
- upgrades después de alcanzar un límite;
- churn después de alcanzar un límite;
- tiempo hasta alcanzar cada límite;
- plan más utilizado;
- ARPU;
- MRR;
- retención;
- expansión.

### Interpretación

Si casi nadie alcanza los límites:

> pueden ser suficientemente altos o el producto todavía tiene poco uso.

Si demasiados clientes los alcanzan muy rápidamente:

> pueden ser demasiado bajos.

Si los clientes abandonan en vez de actualizar:

> el límite está bloqueando valor en lugar de generar expansión.

No cambiar límites por intuición.

---

# 23. Referencia competitiva

La investigación actual confirma que limitar capacidad mediante usuarios, trabajadores y obras activas es un patrón existente en el mercado.

Tabiquo publica actualmente límites de usuarios internos, trabajadores y obras activas y distingue expresamente entre obras activas y archivadas. citeturn0search0turn0search4

Obra Sys utiliza obras activas y usuarios como ejes de sus planes: actualmente muestra 2 obras activas/1 usuario en Starter y 10 usuarios/obras ilimitadas en Professional. citeturn0search1

GremIA diferencia actualmente usuarios de oficina, usuarios de obra/móvil y volumen de obras entre sus planes. citeturn1search0

### Conclusión

El modelo de ObraKit es coherente con el mercado, pero debe mantenerse deliberadamente más simple.

---

# 24. Tabla pública recomendada

La comunicación pública inicial puede reducirse a:

| | Starter | Pro | Business |
|---|---:|---:|---:|
| Precio | 29,99 €/mes | 59,99 €/mes | 99,99 €/mes |
| Usuarios | 2 | 5 | 10 |
| Empleados | 5 | 15 | 30 |
| Obras activas | 3 | 10 | 25 |

Mensaje:

> **Todas las funcionalidades principales incluidas. Elige la capacidad que necesita tu negocio.**

---

# 25. Trial

## [DECISIÓN]

ObraKit ofrecerá **14 días de prueba gratuita, sin tarjeta bancaria**.

Durante el trial:
- el usuario podrá registrarse directamente en ObraKit;
- tendrá acceso al Starter;
- podrá probar el circuito real de gestión;
- no se solicitará tarjeta para comenzar.

### Conversión

**Registro → Trial → 14 días → contratación → suscripción activa**

El usuario podrá contratar un plan durante el trial. Al finalizar los 14 días, si no existe una suscripción de pago, la cuenta dejará de tener acceso operativo según las reglas del producto y comenzará el período de conservación definido por la política de privacidad.

No habrá conversión automática a un plan de pago.

### Conservación y eliminación de datos

Principio comercial:

> **No conservar indefinidamente los datos de usuarios que prueban ObraKit y no contratan un plan.**

Los datos deberán eliminarse o anonimizarse cuando corresponda, conforme a una política de conservación previamente definida y revisada jurídicamente.

La duración exacta del período posterior al trial queda pendiente de definición legal y no debe implementarse como borrado inmediato por defecto.

---

# 26. Annual

## [DECISIÓN]

Todos los planes estándar:

- Starter: 299,90 €/año;
- Pro: 599,90 €/año;
- Business: 999,90 €/año.

Regla:

> **pagar 10 meses y obtener 12 meses de servicio.**

---

# 27. Founder

## [DECISIÓN]

Founder no se obtiene por registrarse ni por iniciar el trial. Está limitado a los **primeros 50 clientes de pago elegibles**.

- Registro ≠ Founder.
- Trial ≠ Founder.
- Primer pago elegible = Founder.

### Beneficio

> **Starter por 19,99 €/mes durante los primeros 12 meses.**

Después de los 12 meses, la suscripción pasará al precio comercial vigente del plan correspondiente, salvo decisión comercial posterior.

Founder:
- mantiene límites Starter;
- mantiene capacidades Starter;
- no crea funcionalidades adicionales;
- no es un plan funcional independiente;
- está limitado a 50 clientes;
- se asigna por orden de conversión/pago elegible.

### Founder y anual

El precio Founder es una oferta mensual especial. El descuento anual estándar de 10 meses por 12 meses no se acumula automáticamente con Founder. Cualquier oferta anual específica requerirá una decisión posterior.

---

# 28. Decisiones todavía abiertas

Aunque pricing y límites principales están cerrados, todavía deben decidirse o validarse:

- trial definitivo;
- comportamiento de expiración;
- conversión automática/no automática;
- recuperación de cuentas;
- política de prorrateo;
- upgrades/downgrades financieros;
- reembolsos;
- cupones;
- add-ons;
- overages;
- funcionalidades premium futuras;
- Enterprise;
- política fiscal definitiva.

Estas decisiones no deben inventarse durante la implementación técnica.

---

# 29. Regla para el módulo de suscripciones

Antes de tocar:

- `plans`;
- `subscriptions`;
- access layer;
- límites;
- trial;
- billing;
- upgrade;
- downgrade;

Desarrollo debe auditar la implementación existente contra este documento.

El resultado de la auditoría debe separar:

### CORRECTO
Coincide con la estrategia.

### INCORRECTO
Contradice una decisión aprobada.

### PREMATURO
Codifica una hipótesis que todavía no se ha cerrado.

### FALTA
Necesario para soportar la estrategia.

### NO TOCAR
No necesario para v1.0.0.

No introducir nuevas decisiones comerciales durante la implementación.

Si aparece una cuestión no cubierta:

> **Estrategia Comercial → decisión → actualización de este documento → Desarrollo.**

---

# 30. Resumen ejecutivo para Desarrollo

## Starter
**29,99 €/mes**
- 2 usuarios
- 5 empleados
- 3 obras activas

## Pro
**59,99 €/mes**
- 5 usuarios
- 15 empleados
- 10 obras activas

## Business
**99,99 €/mes**
- 10 usuarios
- 30 empleados
- 25 obras activas

## Annual
**10 meses pagados / 12 meses de servicio**

## Trial
**14 días**
- gratuito
- sin tarjeta
- acceso Starter
- sin conversión automática
- si no convierte, finaliza el acceso operativo según la política definida

## Founder
**Primeros 50 clientes de pago elegibles**
- Starter
- 19,99 €/mes durante 12 meses
- mismos límites que Starter
- no es un plan funcional independiente
- se obtiene por primer pago elegible, no por registro

## Lógica de límites
- obras = **obras activas**, no histórico total;
- histórico conservado;
- límite alcanzado = no crear nuevos recursos que excedan capacidad;
- datos existentes siempre conservados;
- downgrade = no borrar datos; puede existir exceso de capacidad;
- usuario ≠ empleado;
- empleado que además tiene login consume ambos límites;
- no cobrar por empleado individualmente en esta etapa.

---

# 31. Principio final

La estrategia actual es deliberadamente sencilla:

> **Mismas capacidades principales. Más capacidad operativa a medida que crece el negocio.**

Más adelante:

> **más capacidad + más funcionalidades de alto valor + automatización + integraciones + soporte avanzado.**

La evolución del pricing debe seguir la evolución real del valor del producto.

---

# 32. Estado de la decisión

**PRICING:** APROBADO
**PACKAGING:** APROBADO
**LÍMITES:** APROBADOS
**MODELO POR CAPACIDAD:** APROBADO
**OBRAS ACTIVAS, NO HISTÓRICAS:** APROBADO
**USUARIOS ≠ EMPLEADOS:** APROBADO
**HARD LIMIT PARA NUEVAS ALTAS:** APROBADO
**NO BORRAR DATOS AL SUPERAR/DOWNGRADE:** APROBADO
**DIFERENCIACIÓN POR FEATURES:** POSPUESTA HASTA MAYOR MADUREZ
**TRIAL:** PENDIENTE
**IMPLEMENTACIÓN TÉCNICA:** NO CERRAR DESDE ESTE DOCUMENTO
