"use client";

import { motion } from "framer-motion";

import ProductDashboard from "./ProductDashboard";

const ProductShowcase = () => {
  return (
    <section
      id="product"
      className="!bg-white py-24 sm:py-32"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-primary"
          >
            Todo conectado
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-5xl"
          >
            Todo lo que necesitas.
            <br />
            <span className="text-slate-400">En un solo lugar.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            Clientes, obras, equipos, materiales y finanzas conectados para
            que puedas ver qué está pasando en tu empresa de un vistazo.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <ProductDashboard />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-1/2 -z-10 h-64 w-3/4 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
