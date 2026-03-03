interface SpvBannerProps {
  title: string;
  description: string;
  accentColor: "green" | "blue" | "orange" | "purple";
}

const borderColors = {
  green: "border-l-green-500",
  blue: "border-l-blue-500",
  orange: "border-l-orange-500",
  purple: "border-l-purple-500",
};

const bgColors = {
  green: "bg-green-50",
  blue: "bg-blue-50",
  orange: "bg-orange-50",
  purple: "bg-purple-50",
};

const textColors = {
  green: "text-green-700",
  blue: "text-blue-700",
  orange: "text-orange-700",
  purple: "text-purple-700",
};

export function SpvBanner({ title, description, accentColor }: SpvBannerProps) {
  return (
    <div
      className={`rounded-lg border-l-4 p-4 ${borderColors[accentColor]} ${bgColors[accentColor]}`}
    >
      <h3 className={`text-sm font-semibold ${textColors[accentColor]}`}>
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
