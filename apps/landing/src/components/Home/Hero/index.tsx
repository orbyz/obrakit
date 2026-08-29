"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import HeroProductPreview from "./HeroProductPreview";

const Hero = () => {
  return (
    <section
      id="main-banner"
      className="relative overflow-hidden bg-secondary pb-20 pt-36 sm:pb-28 sm:pt-44"
    >
      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 xl:gap-16">
          {/* Copy */}
          <motion.div
            initial={{ x: "-40px", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-7 text-center lg:items-start lg:text-left"
          >
            <Badge
              variant="outline"
              className="rounded-full border-white/10 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              Software de gestión para empresas de reformas
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl xl:text-[76px]">
                La obra avanza.
                <br />
                <span className="text-primary">El caos no.</span>
              </h1>

              <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                Gestiona clientes, presupuestos, obras, equipos, materiales y
                finanzas desde un único centro de mando.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                render={<Link href="/#product" />}
                className="h-12 rounded-lg border border-primary bg-primary px-6 text-base font-semibold text-background hover:bg-primary/85"
              >
                Solicitar demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                render={<Link href="/#how-it-works" />}
                variant="outline"
                className="h-12 rounded-lg border-white/15 bg-transparent px-6 text-base font-medium text-white hover:bg-white/5"
              >
                <Play className="mr-2 h-4 w-4" />
                Ver cómo funciona
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/75 lg:justify-start">
              <span>✓ Clientes</span>
              <span>✓ Obras</span>
              <span>✓ Equipo</span>
              <span>✓ Materiales</span>
              <span>✓ Finanzas</span>
            </div>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ x: "40px", opacity: 0, scale: 0.96 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative z-10 flex justify-center lg:translate-x-6 lg:justify-end xl:translate-x-10"
          >
            <HeroProductPreview />
          </motion.div>
        </div>
      </div>

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[2%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-primary/10 blur-[170px]"
      />
    </section>
  );
};

export default Hero;
