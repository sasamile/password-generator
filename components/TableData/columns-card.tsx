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
import Image from "next/image";

export type ColumnsProps = Element;

const validateCardType = (number: string) => {
  const cleanedNumber = number.replace(/\s/g, "");
  const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const masterCardPattern = /^5[1-5][0-9]{14}$/;

  if (visaPattern.test(cleanedNumber)) return "Visa";
  if (masterCardPattern.test(cleanedNumber)) return "MasterCard";
  return "Invalid card number";
};

export const columnsCard: ColumnDef<ColumnsProps>[] = [
  {
    accessorKey: "Icons",
    header: "Icons",
    cell: ({ row }) => {
      const cardNumber = row.original.numberCard; // Asegúrate de que este es el campo correcto
      let icon = <File className="w-4 h-4" />; // Icono por defecto

      // Verifica si el número de tarjeta no es nulo
      if (cardNumber) {
        // Cambié 'url' a 'cardNumber' para que tenga sentido
        const cardType = validateCardType(cardNumber); // Validar el tipo de tarjeta
        if (cardType === "Visa") {
          icon = (
            <Image
              src="/icons/visa.svg"
              alt="Visa logo"
              className="w-4 h-4"
              width={200}
              height={200}
            />
          );
        } else if (cardType === "MasterCard") {
          icon = (
            <Image
              src="/icons/mastercard.svg"
              alt="MasterCard logo"
              width={200}
              height={200}
              className="w-4 h-4"
            />
          );
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
    accessorKey: "numberCard",
    header: "Number Card",
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => {
      const password = row.original.password;
      const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado local para la visibilidad de la contraseña

      // Cambié el nombre de la función para que sea más descriptivo
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
      const numberCard = row.original.numberCard;

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
            {numberCard && (
            <div className="flex items-center">
              <User
                className="w-4 h-4 cursor-pointer "
                onClick={() => copyItemClipboard(numberCard, "Number card")}
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
