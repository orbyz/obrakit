interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  color?: "green" | "orange" | "blue" | "gray";
}

const colorClasses = {
  green: "text-green-600",
  orange: "text-orange-600",
  blue: "text-blue-600",
  gray: "text-gray-600",
};

export default function StatCard({
  label,
  value,
  subtext,
  icon,
  color = "gray",
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}
