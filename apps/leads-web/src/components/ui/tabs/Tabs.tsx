import Link from "next/link";

interface TabItem<T extends string> {
  value: T;
  label: React.ReactNode;
  href?: string;
}

interface TabsProps<T extends string> {
  value: T;
  onChange?: (value: T) => void;
  items: TabItem<T>[];
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: TabsProps<T>) {
  return (
    <div className="mb-6 flex gap-2 border-b border-border">
      {items.map((item) => {
        const className = `
          border-b-2
          px-4
          py-3
          text-sm
          font-medium
          transition-all

          ${
            value === item.value
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-text"
          }
        `;

        if (item.href) {
          return (
            <Link key={item.value} href={item.href} className={className}>
              {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange?.(item.value)}
            className={className}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
