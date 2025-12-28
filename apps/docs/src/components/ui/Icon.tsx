import { icons, type LucideProps } from "lucide-react";

const Icon = ({ name, color, size, ...props }: Omit<LucideProps, "name"> & { name: keyof typeof icons }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size || 24} {...props} />;
};

export { Icon };
