"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { headerData } from "./Navigation/menuData";
import { APP_ROUTES } from "@/config/urls";
import Logo from "./Logo";

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY >= 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        sticky || menuOpen
          ? "border-b border-white/10 bg-secondary/90 py-4 backdrop-blur-xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-6">
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {headerData.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/65 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              render={<Link href={APP_ROUTES.login} />}
              variant="ghost"
              className="text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              Iniciar sesión
            </Button>

            <Button
              render={<Link href={APP_ROUTES.register} />}
              className="h-10 rounded-lg bg-primary px-5 font-semibold text-background hover:bg-primary/85"
            >
              Solicitar demo
            </Button>
          </div>

          {/* Mobile */}
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="mt-5 border-t border-white/10 pt-5 lg:hidden">
            <nav className="flex flex-col gap-1">
              {headerData.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 grid gap-2 border-t border-white/10 pt-4">
                <Button
                  render={<Link href={APP_ROUTES.login} />}
                  variant="outline"
                  className="h-11 border-white/10 bg-transparent text-white hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Button>

                <Button
                  render={<Link href={APP_ROUTES.register} />}
                  className="h-11 bg-primary font-semibold text-background hover:bg-primary/85"
                  onClick={() => setMenuOpen(false)}
                >
                  Solicitar demo
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
