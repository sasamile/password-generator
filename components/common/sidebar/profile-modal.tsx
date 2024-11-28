
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Loader2, EyeOff, Eye } from "lucide-react";
import { getUserByEmail, patchUser } from "@/actions/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadFile } from "@/actions/uploadthing-actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/auth/loading";
import { cn } from "@/lib/utils";

export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!session?.user?.email) {
          setError("No estás autenticado. Por favor, inicia sesión.");
          setIsLoading(false);
          return;
        }
        const userData = await getUserByEmail(session.user.email);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
        setError("Error al cargar los datos del usuario.");
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) {
      loadUser();
    }
  }, [session, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // Tamaño máximo de la imagen 4MB
      if (file.size > maxSizeInBytes) {
        setImageSrc("");
        toast.error(
          "La imagen seleccionada excede el tamaño máximo permitido de 4MB."
        );
        return;
      }

      setImageFile(file);

      const src = URL.createObjectURL(file);
      setImageSrc(src);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    if (!editedUser) return;

    try {
      setIsLoading(true);

      // Handle image upload if a new image is selected
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const response = await uploadFile(formData);

        if (response?.success && response.fileUrl) {
          imageUrl = response.fileUrl; // Guardar la URL de la imagen si se sube
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Actualizar el usuario con los datos editados
      await patchUser(editedUser, imageUrl, password); // Pasar imageUrl, que puede ser undefined
      setPassword("");
      setEditedUser(null);
      setImageFile(null);
      setIsLoading(false);

      setUser(editedUser); // Actualizar el estado del usuario

      toast.success("Perfil actualizado exitosamente");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {isLoading ? ( // Mostrar Loading mientras se carga
          <div className="flex items-center justify-center h-64">
            <Loading />
          </div>
        ) : (
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-primary">
                Perfil de Usuario
              </DialogTitle>
            </DialogHeader>
            {error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">{error}</p>
              </div>
            ) : user && editedUser ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage
                          className="object-cover"
                          src={imageSrc || editedUser.image!}
                          alt={editedUser.name!}
                        />
                        <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                          {editedUser.name!.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="image-upload"
                        className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors duration-200 group-hover:opacity-100 opacity-0"
                      >
                        <Pencil className="w-5 h-5 text-primary-foreground" />
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-600"
                      >
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedUser.name!}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-600"
                      >
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={editedUser.email!}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-600"
                      >
                        Password
                      </Label>
                      <div className="relative flex items-center justify-between">
                        <Input
                          id="password"
                          name="password"
                          className={cn("pr-11 border-[#525252]")}
                          type={showPassword ? "text" : "password"}
                          placeholder="8+ caracteres"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />

                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute right-0 hover:bg-transparent p-0 mr-2"
                        >
                          {showPassword ? (
                            <EyeOff className="min-w-5 min-h-5 shrink-0" />
                          ) : (
                            <Eye className="min-w-5 min-h-5 shrink-0" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditedUser(user);
                            setImageFile(null);
                            setPassword("");
                            onClose();
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Guardar Cambios
                        </Button>
                      </>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export default ProfileModal;