interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="border-b border-border pb-2 text-sm font-semibold text-text">
        {title}
      </h3>

      {children}
    </section>
  );
}
