export default function SubscriptionRequiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-secondary">
          Tu período de prueba ha terminado
        </h1>

        <p className="mt-3 text-muted">
          Has utilizado tus 7 días de prueba de ObraKit. Para continuar
          utilizando la aplicación, necesitas activar una suscripción.
        </p>

        <p className="mt-4 text-sm text-muted">
          Próximamente podrás elegir la opción que mejor se adapte a tu
          negocio.
        </p>
      </section>
    </main>
  );
}
