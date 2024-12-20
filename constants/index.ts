import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  ContactRound,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  LayoutGridIcon,
  ListIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Star,
} from "lucide-react";

export const SidebarNav = {
  navMain: [
    {
      title: "Password list",
      url: "/",
      icon: ListIcon,
      isActive: true,
    },
    {
      title: "Password",
      url: "#",
      icon: LayoutGridIcon,
      items: [
        {
          title: "Favorites",
          url: "/favorites",
          icon: Star,
        },
        {
          title: "Credit Card",
          url: "/credit-elements",
          icon: CreditCard ,
        },
      ],
    },
    {
      title: "Generator",
      url: "/generator",
      icon: BookOpen,
    },
  ],
  projects: [
    {
      name: "Analytics",
      url: "/analytics",
      icon: PieChart,
    },
  ],
};
