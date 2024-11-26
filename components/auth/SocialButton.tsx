import Image from "next/image";
import { Button } from "../ui/button";


interface SocialButtonProps {
  label: string;
  onClick: () => void;
  label2: string;
  iconClassName?: string;
}

export function SocialButton({
  label,
  label2,
  onClick,
}: SocialButtonProps) {
  return (
    <Button
      size="lg"
      className="relative  py-6 gap-5 w-[350px] "
      variant="default"
      onClick={onClick}
    >
      {label === "Microsoft"}

      <Image
        src={`${
          label2 === "Microsoft" ? "/icons/microsoft.svg" : "/icons/google.svg"
        }`}
        alt="Logo"
        width={100}
        height={100}
        className="w-5 h-5"
      />

      <p className="text-sm text-white font-semibold select-none">{label}</p>
    </Button>
  );
}
