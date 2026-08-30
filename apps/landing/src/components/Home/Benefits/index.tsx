"use client";

import {
  BarChart3,
  Layers3,
  TimerReset,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Layers3,
    title: "Todo en un mismo sitio",
    description:
      "Clientes, obras, equipos, materiales y finanzas conectados en un único espacio.",
  },
  {
    icon: BarChart3,
    title: "Decisiones con información real",
    description:
      "Consulta costes, ingresos y rentabilidad sin depender de cálculos manuales.",
  },
  {
    icon: TimerReset,
    title: "Menos tiempo gestionando",
    description:
      "Reduce el trabajo administrativo y dedica más tiempo a hacer crecer tu empresa.",
  },
];

const Benefits = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-primary"
          >
            Menos gestión. Más control.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-5xl"
          >
            Recupera el control de tu empresa.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            ObraKit conecta la información de tu negocio para que puedas
            gestionar tus obras con menos esfuerzo y tomar mejores decisiones.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
