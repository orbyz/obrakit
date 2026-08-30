"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";

const faqData = [
  {
    question: "¿Qué es ObraKit?",
    answer:
      "ObraKit es una plataforma de gestión para empresas de reformas y construcción que conecta clientes, obras, equipos, materiales y finanzas en un mismo lugar.",
  },
  {
    question: "¿Para quién está pensado ObraKit?",
    answer:
      "Está pensado para profesionales y empresas de reformas y construcción que necesitan organizar mejor sus obras y tener una visión clara de lo que ocurre en su negocio.",
  },
  {
    question: "¿Qué puedo gestionar con ObraKit?",
    answer:
      "Puedes centralizar la gestión de clientes, obras, equipos, materiales, presupuestos y la información financiera relacionada con tus proyectos.",
  },
  {
    question: "¿Puedo gestionar varias obras al mismo tiempo?",
    answer:
      "Sí. ObraKit está pensado para que puedas tener una visión global de tus proyectos y consultar el estado de cada obra desde un mismo espacio.",
  },
  {
    question: "¿Puedo controlar la rentabilidad de mis obras?",
    answer:
      "Sí. ObraKit conecta los costes, ingresos y demás información financiera relacionada con tus obras para ayudarte a entender cómo está funcionando cada proyecto.",
  },
  {
    question: "¿Cuánto cuesta ObraKit?",
    answer:
      "ObraKit tendrá un plan Starter de 29,99 € al mes y un plan Pro de 59,99 € al mes. También estará disponible una modalidad anual equivalente a 10 meses de precio, con 12 meses de servicio.",
  },
  {
    question: "¿Qué es el programa Founder?",
    answer:
      "Los primeros 20 clientes que contraten ObraKit podrán acceder a una condición especial Founder: 19,99 € al mes en el plan Starter durante su primer año.",
  },
];

const Faq = () => {
  return (
    <section id="faq" className="!bg-secondary py-24 text-white sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Preguntas frecuentes
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
              Todo lo que necesitas saber.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              Resolvemos las dudas más habituales antes de empezar a trabajar
              con ObraKit.
            </p>
          </div>

          <Accordion className="space-y-3">
            {faqData.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 px-5"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium text-white hover:no-underline sm:text-lg **:data-[slot=accordion-trigger-icon]:hidden">
                  {item.question}

                  <PlusIcon className="h-5 w-5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45" />
                </AccordionTrigger>

                <AccordionContent className="pb-5 text-sm leading-6 text-white/60 sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
