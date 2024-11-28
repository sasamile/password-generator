"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Element } from "@prisma/client";
import { fetchData } from "@/actions/element";
import CardTable from "@/components/TableData/card-table";
import TableData from "@/components/TableData/table-data";
import { useTheme } from "next-themes";
import Image from "next/image";

function Home() {
  const user = useCurrentUser();
  const { theme, systemTheme } = useTheme();

  if (!user) {
    return redirect("/");
  }

  const [favorites, setFavorites] = useState<Element[]>([]);
  const [cardFavorites, setCardFavorites] = useState<Element[]>([]);

  const updateData = async () => {
    const newData = await fetchData(user.id);
    if (Array.isArray(newData)) {
      // Filtrar elementos favoritos
      const filteredFavorites = newData.filter(
        (item) =>
          (item.isFavorite === true && item.typeElement === "logins") ||
          item.typeElement === "other"
      );
      // Filtrar elementos de tipo "card"
      const filteredCardFavorites = newData.filter(
        (item) => item.isFavorite === true && item.typeElement === "card"
      );
      setFavorites(filteredFavorites);
      setCardFavorites(filteredCardFavorites);
    } else {
      console.error("Error fetching data:", newData.error);
    }
  };
  useEffect(() => {
    updateData();
  }, [user.id]);

  const getImageSource = () => {
    // Si el tema es system, usamos systemTheme para determinar la imagen
    if (theme === "system") {
      return systemTheme === "dark"
        ? "/icons/petting.svg"
        : "/icons/petting2.svg";
    }
    // Si no es system, usamos la lógica original
    return theme === "dark" ? "/icons/petting.svg" : "/icons/petting2.svg";
  };

  return (
    <div>
      <h1 className="text-[28px] font-bold ">List of favorite passwords</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center ">
          <Image
            src={getImageSource()}
            alt="logoespera"
            width={300}
            height={400}
          />

          <div className="alert">No data available.</div>
        </div>
      ) : (
        <TableData elements={favorites} />
      )}
      {cardFavorites.length > 0 && (
        <>
          <h1 className="text-[28px] font-bold ">Favorite Credit Card List</h1>
          <CardTable elements={cardFavorites} />
        </>
      )}
    </div>
  );
}

export default Home;
