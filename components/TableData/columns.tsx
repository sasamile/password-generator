"use client";

import { Element } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Copy,
  Eye,
  EyeOff,
  File,
  MoreHorizontal,
  Pencil,
  User,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  FaGithub,
  FaLinkedin,
  FaGoogle,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaYoutube,
  FaTiktok,
  FaSnapchat,
  FaReddit,
  FaTumblr,
  FaFlickr,
  FaVimeo,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaQuora,
  FaMedium,
  FaSkype,
  FaSlack,
  FaSoundcloud,
  FaBehance,
  FaDribbble,
  FaMix,
  FaOdnoklassniki,
  FaTwitch,
  FaWeibo,
  FaLine,
  FaYelp,
  FaTripadvisor,
  FaFoursquare,
  FaLastfm,
  FaDailymotion,
  FaMixcloud,
  FaPeriscope,
  FaBitbucket,
  FaGitlab,
  FaCodepen,
  FaJsfiddle,
  FaStackOverflow,
  FaDev,
  FaMeetup,
  FaGoodreads,
  FaArchive,
  FaSlideshare,
  FaVk,
  FaBandcamp,
  FaAngellist,
  FaProductHunt,
  FaHackerNews,
  FaDeviantart, // Corregido el error tipográfico
  FaArtstation,
  FaEtsy,
} from "react-icons/fa"; // Importa los iconos que necesites
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ElementIdPage from "../common/form-edit-element/element-id";

// Define el tipo para el estado de la tienda
interface PasswordStore {
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColumnsProps = Element;

const iconMap: { [key: string]: JSX.Element } = {
  "github.com": <FaGithub className="w-4 h-4 " />,
  "linkedin.com": <FaLinkedin className="w-4 h-4 " />,
  "google.com": <FaGoogle className="w-4 h-4 " />,
  "mail.google.com": <FaGoogle className="w-4 h-4 " />,
  "facebook.com": <FaFacebook className="w-4 h-4 " />,
  "instagram.com": <FaInstagram className="w-4 h-4 " />,
  "twitter.com": <FaTwitter className="w-4 h-4 " />,
  "pinterest.com": <FaPinterest className="w-4 h-4 " />,
  "youtube.com": <FaYoutube className="w-4 h-4 " />,
  "tiktok.com": <FaTiktok className="w-4 h-4 " />,
  "snapchat.com": <FaSnapchat className="w-4 h-4 " />,
  "reddit.com": <FaReddit className="w-4 h-4 " />,
  "tumblr.com": <FaTumblr className="w-4 h-4 " />,
  "flickr.com": <FaFlickr className="w-4 h-4 " />,
  "vimeo.com": <FaVimeo className="w-4 h-4 " />,
  "whatsapp.com": <FaWhatsapp className="w-4 h-4 " />,
  "telegram.org": <FaTelegram className="w-4 h-4 " />,
  "discord.com": <FaDiscord className="w-4 h-4 " />,
  "quora.com": <FaQuora className="w-4 h-4 " />,
  "medium.com": <FaMedium className="w-4 h-4 " />,
  "skype.com": <FaSkype className="w-4 h-4 " />,
  "slack.com": <FaSlack className="w-4 h-4 " />,
  "soundcloud.com": <FaSoundcloud className="w-4 h-4 " />,
  "behance.net": <FaBehance className="w-4 h-4 " />,
  "dribbble.com": <FaDribbble className="w-4 h-4 " />,
  "mix.com": <FaMix className="w-4 h-4 " />,
  "weibo.com": <FaWeibo className="w-4 h-4 " />,
  "twitch.tv": <FaTwitch className="w-4 h-4 " />,
  "ok.ru": <FaOdnoklassniki className="w-4 h-4 " />,
  "line.me": <FaLine className="w-4 h-4 " />,
  "yelp.com": <FaYelp className="w-4 h-4 " />,
  "tripadvisor.com": <FaTripadvisor className="w-4 h-4 " />,
  "foursquare.com": <FaFoursquare className="w-4 h-4 " />,
  "last.fm": <FaLastfm className="w-4 h-4 " />,
  "dailymotion.com": <FaDailymotion className="w-4 h-4 " />,
  "mixcloud.com": <FaMixcloud className="w-4 h-4 " />,
  "periscope.tv": <FaPeriscope className="w-4 h-4 " />,
  "t.me": <FaTelegram className="w-4 h-4 " />,
  "t.co": <FaTwitter className="w-4 h-4 " />,
  "bitbucket.org": <FaBitbucket className="w-4 h-4 " />,
  "gitlab.com": <FaGitlab className="w-4 h-4 " />,
  "codepen.io": <FaCodepen className="w-4 h-4 " />,
  "jsfiddle.net": <FaJsfiddle className="w-4 h-4 " />,
  "stackoverflow.com": <FaStackOverflow className="w-4 h-4 " />,
  "dev.to": <FaDev className="w-4 h-4 " />,
  "github.io": <FaGithub className="w-4 h-4 " />,
  "meetup.com": <FaMeetup className="w-4 h-4 " />,
  "goodreads.com": <FaGoodreads className="w-4 h-4 " />,
  "archive.org": <FaArchive className="w-4 h-4 " />,
  "slideshare.net": <FaSlideshare className="w-4 h-4 " />,
  "vkontakte.ru": <FaVk className="w-4 h-4 " />,
  "bandcamp.com": <FaBandcamp className="w-4 h-4 " />,
  "angellist.com": <FaAngellist className="w-4 h-4 " />,
  "producthunt.com": <FaProductHunt className="w-4 h-4 " />,
  "hackernews.com": <FaHackerNews className="w-4 h-4 " />,
  "deviantart.com": <FaDeviantart className="w-4 h-4 " />, // Corregido el error tipográfico
  "artstation.com": <FaArtstation className="w-4 h-4" />,
  "etsy.com": <FaEtsy className="w-4 h-4 " />,
  "discordapp.com": <FaDiscord className="w-4 h-4 " />,
};

export const columns: ColumnDef<ColumnsProps>[] = [
  {
    accessorKey: "Icons",
    header: "Icons",
    cell: ({ row }) => {
      const url = row.original.urlWebsite;
      let icon = <File className="w-4 h-4" />; // Icono por defecto

      // Verifica si la URL no es nula
      if (url) {
        // Busca en el mapa de iconos
        for (const key in iconMap) {
          if (url.includes(key)) {
            icon = iconMap[key];
            break; // Salir del bucle una vez que se encuentra el icono
          }
        }
      }

      return <div className="ml-3">{icon}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => {
      const password = row.original.password;
      const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado local para la visibilidad de la contraseña

      const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev); // Alternar la visibilidad
      };

      return (
        <div className="flex items-center gap-2">
          <span className="text-xs">
            {isPasswordVisible ? password : "***********"}
          </span>
          <Button onClick={togglePasswordVisibility} variant={"ghost"}>
            {isPasswordVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.original.notes;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"ghost"} className="-ml-4">
              View Notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-2">Notes</DialogTitle>
              <DialogDescription>
                {notes ? notes : "No notes available."}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const password = row.original.password;
      const username = row.original.username;
      const [open, isOpen] = useState(false);

      const copyItemClipboard = (item: string, name: string) => {
        navigator.clipboard.writeText(item);
        toast.success(`${name} Copied Success `);
      };

      return (
        <div className="flex gap-2 justify-center items-center">
          {password && (
            <div className="flex items-center">
              <Copy
                className="w-4 h-4 cursor-pointer"
                onClick={() => copyItemClipboard(password, "Password")}
              />
            </div>
          )}
          {username && (
            <div className="flex items-center">
              <User
                className="w-4 h-4 cursor-pointer "
                onClick={() => copyItemClipboard(username, "Username")}
              />
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => isOpen(true)}>
                <div className="flex gap-2 items-center">
                  <Pencil className="w-4 h-4" /> Edit
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={open} onOpenChange={isOpen}>
            <DialogContent>
              <ElementIdPage
                elementID={row.original.id}
                Open={open}
                isOpen={isOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
