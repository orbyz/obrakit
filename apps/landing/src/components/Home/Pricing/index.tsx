"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { APP_ROUTES } from "@/config/urls";

type BillingPeriod = "monthly" | "yearly";

const plans = [
  {
    name: "Starter",
    description: "Para empezar a gestionar tu empresa con todo bajo control.",
    monthlyPrice: 29.99,
    users: "2 usuarios",
    employees: "5 empleados",
    projects: "3 obras activas",
    recommended: false,
  },
  {
    name: "Pro",
    description: "Más capacidad para empresas que ya están creciendo.",
    monthlyPrice: 59.99,
    users: "5 usuarios",
    employees: "15 empleados",
    projects: "10 obras activas",
    recommended: true,
  },
  {
    name: "Business",
    description: "Para equipos que gestionan un mayor volumen de trabajo.",
    monthlyPrice: 99.99,
    users: "10 usuarios",
    employees: "30 empleados",
    projects: "25 obras activas",
    recommended: false,
  },
];

const formatPrice = (price: number) =>
  price.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriod>("monthly");

  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-primary"
          >
            Precios sencillos. Sin sorpresas.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-5xl"
          >
            Elige el espacio que necesita tu empresa.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            Empieza con lo que necesitas hoy y amplía tu capacidad cuando tu
            negocio crezca.
          </motion.p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-secondary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Mensual
            </button>

            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-secondary text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Anual
              <span className="ml-2 text-primary">2 meses gratis</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          {billingPeriod === "yearly"
            ? "Paga 10 meses y disfruta de 12 meses de servicio."
            : "También puedes ahorrar contratando el plan anual."}
        </p>

        {/* Plans */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const yearlyPrice = plan.monthlyPrice * 10;
            const displayPrice =
              billingPeriod === "yearly"
                ? yearlyPrice
                : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  plan.recommended
                    ? "border-primary/50 bg-secondary text-white shadow-xl shadow-primary/10"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-secondary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Recomendado
                    </span>
                  </div>
                )}

                <div>
                  <h3
                    className={`text-xl font-semibold ${
                      plan.recommended ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className={`mt-2 min-h-12 text-sm leading-6 ${
                      plan.recommended ? "text-white/60" : "text-slate-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mt-7">
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-4xl font-semibold tracking-tight ${
                        plan.recommended ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {formatPrice(displayPrice)} €
                    </span>

                    <span
                      className={`mb-1 text-sm ${
                        plan.recommended ? "text-white/50" : "text-slate-400"
                      }`}
                    >
                      {billingPeriod === "yearly" ? "/ año" : "/ mes"}
                    </span>
                  </div>

                  {billingPeriod === "yearly" && (
                    <p
                      className={`mt-1 text-xs ${
                        plan.recommended ? "text-white/45" : "text-slate-400"
                      }`}
                    >
                      Equivale a {formatPrice(plan.monthlyPrice)} €/mes
                    </p>
                  )}
                </div>

                <div
                  className={`my-7 border-t ${
                    plan.recommended ? "border-white/10" : "border-slate-100"
                  }`}
                />

                <ul className="space-y-4">
                  {[plan.users, plan.employees, plan.projects].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.recommended
                            ? "bg-primary/15 text-primary"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>

                      <span
                        className={`text-sm ${
                          plan.recommended ? "text-white/75" : "text-slate-600"
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}

                  <li className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.recommended
                          ? "bg-primary/15 text-primary"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>

                    <span
                      className={`text-sm ${
                        plan.recommended ? "text-white/75" : "text-slate-600"
                      }`}
                    >
                      Todas las funcionalidades
                    </span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    href={APP_ROUTES.register}
                    className={`flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      plan.recommended
                        ? "bg-primary text-secondary hover:bg-primary/85"
                        : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Empezar con {plan.name}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Founder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-2xl border border-primary/25 bg-primary/5"
        >
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Founder · primeros 50 clientes
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  19,99 €/mes durante tus primeros 12 meses.
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Incluye las condiciones del plan Starter. Después se aplica
                  el precio vigente de Starter.
                </p>
              </div>
            </div>

            <Link
              href={APP_ROUTES.register}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-secondary px-5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
            >
              Quiero ser Founder
            </Link>
          </div>
        </motion.div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-slate-400">
          Los límites se refieren a capacidad de uso. Tus datos históricos no
          se eliminan si cambias de plan.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
