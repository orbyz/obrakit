import type { FC } from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { headerData } from "../Header/Navigation/menuData";
import Logo from "../Header/Logo";
import { Separator } from "@/components/ui/separator";
import { APP_ROUTES } from "@/config/urls";

const Footer: FC = () => {
  return (
    <footer className="bg-secondary pt-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] lg:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Logo />

            <p className="max-w-sm text-sm leading-6 text-white/60">
              Todo lo que necesitas para gestionar tu empresa de reformas, en
              un solo lugar.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white">
              Producto
            </h3>

            <ul className="space-y-3">
              {headerData.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-white">
              Cuenta
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href={APP_ROUTES.login}
                  className="text-sm text-white/60 transition-colors hover:text-primary"
                >
                  Iniciar sesión
                </Link>
              </li>

              <li>
                <Link
                  href={APP_ROUTES.register}
                  className="text-sm text-white/60 transition-colors hover:text-primary"
                >
                  Crear cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              ¿Listo para tener más control?
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Gestiona tu empresa de reformas desde un solo lugar.
            </p>

            <Button
              render={<Link href={APP_ROUTES.register} />}
              className="mt-5 h-10 rounded-lg bg-primary px-5 font-semibold text-background hover:bg-primary/85"
            >
              Solicitar una demo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-3 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/40">
            © 2026 ObraKit. Todos los derechos reservados.
          </p>

          <p className="text-xs text-white/30">
            Gestión inteligente para empresas de reformas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
