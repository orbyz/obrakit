"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/urls";

const CTA = () => {
  return (
    <section id="demo" className="!bg-white py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Empieza a trabajar de otra manera
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
              Gestiona tus obras con más control.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              Centraliza clientes, obras, equipos, materiales y finanzas en
              un solo lugar. Menos gestión. Más visión sobre tu negocio.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                render={<Link href={APP_ROUTES.register} />}
                className="h-11 rounded-lg bg-primary px-6 font-semibold text-background hover:bg-primary/85"
              >
                Solicitar una demo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>

              <Button
                render={<Link href="/#how-it-works" />}
                variant="ghost"
                className="h-11 px-6 text-white/70 hover:bg-white/5 hover:text-white"
              >
                Ver cómo funciona
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
