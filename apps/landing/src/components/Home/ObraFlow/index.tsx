"use client";

import {
  BriefcaseBusiness,
  CircleDollarSign,
  FileText,
  Package,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import FlowCard from "./FlowCard";

const ObraFlow = () => {
  return (
    <section
      id="how-it-works"
      className="!bg-secondary overflow-hidden py-24 sm:py-32"
    >
      <div className="container">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-primary"
          >
            Una obra. Un solo flujo.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl"
          >
            Todo conectado.
            <br />
            <span className="text-white/45">Todo bajo control.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg"
          >
            Cada parte de tu empresa alimenta a la siguiente. ObraKit conecta
            la información para que puedas tomar decisiones con una visión
            completa de cada obra.
          </motion.p>
        </div>

        {/* Flow */}
        <div className="mx-auto mt-16 max-w-5xl">
          {/* Primary flow */}
          <div className="relative">
            <div className="grid gap-4 md:grid-cols-3">
              <FlowCard
                eyebrow="01 · Cliente"
                title="Carlos Martínez"
                detail="3 obras activas"
                icon={UserRound}
                delay={0}
              />

              <FlowCard
                eyebrow="02 · Presupuesto"
                title="Villa Aurora"
                detail="Presupuesto aprobado"
                value="24.500 €"
                icon={FileText}
                delay={0.1}
                featured
              />

              <FlowCard
                eyebrow="03 · Obra"
                title="Villa Aurora"
                detail="Estado del proyecto"
                value="78% completado"
                icon={BriefcaseBusiness}
                delay={0.2}
              />
            </div>

            {/* Connectors */}
            <div className="pointer-events-none absolute left-1/3 top-1/2 hidden h-px w-1/3 -translate-y-1/2 bg-white/10 md:block" />
          </div>

          {/* Secondary flow */}
          <div className="relative mt-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FlowCard
                eyebrow="04 · Equipo"
                title="4 operarios asignados"
                detail="Trabajo activo en obra"
                icon={Users}
                delay={0.1}
              />

              <FlowCard
                eyebrow="05 · Materiales"
                title="3 pedidos pendientes"
                detail="Control de suministros"
                icon={Package}
                delay={0.2}
              />
            </div>
          </div>

          {/* Financial flow */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FlowCard
              eyebrow="06 · Finanzas"
              title="Costes y cobros"
              detail="Todo relacionado con la obra"
              value="18.240 €"
              icon={CircleDollarSign}
              delay={0.1}
            />

            <FlowCard
              eyebrow="07 · Rentabilidad"
              title="Margen estimado"
              detail="Decisiones basadas en datos"
              value="+18,6%"
              icon={TrendingUp}
              delay={0.2}
              featured
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObraFlow;
