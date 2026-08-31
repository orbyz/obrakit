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
    <div className="mb-6 w-full overflow-x-auto border-b border-border">
      <div className="flex min-w-max gap-1">
        {items.map((item) => {
          const className = `
            inline-flex min-h-11 items-center justify-center
            border-b-2
            px-4
            py-3
            text-sm
            font-medium
            whitespace-nowrap
            transition-colors
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/20
            ${
              value === item.value
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:border-border hover:text-text"
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
    </div>
  );
}
