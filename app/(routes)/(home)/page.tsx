"use client";
import NewElement from "./components/new-element";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import TableData from "@/components/TableData/table-data";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Element } from "@prisma/client";
import { fetchData } from "@/actions/element";
import Image from "next/image";
import { useTheme } from "next-themes";

function Home() {
  const user = useCurrentUser();
  const { theme, systemTheme } = useTheme();

  if (!user) {
    return redirect("/");
  }

  const [data, setData] = useState<Element[]>([]);

  const updateData = async () => {
    const newData = await fetchData(user.id);
    if (Array.isArray(newData)) {
      const filteredData = newData.filter(
        (item) => item.typeElement === "logins" || item.typeElement === "other"
      );
      setData(filteredData);
    } else {
      console.error("Error fetching data:", newData.error);
    }
  };

  useEffect(() => {
    updateData();
  }, [user.id, data]);

  function getImageSource() {
    // Si el tema es system, usamos systemTheme para determinar la imagen
    if (theme === "system") {
      return systemTheme === "dark"
        ? "/icons/Doggie.svg" // Cambiado a Doggie.svg para el tema oscuro
        : "/icons/Doggie2.svg"; // Se mantiene Doggie2.svg para el tema claro
    }
    // Si no es system, usamos la lógica original
    return theme === "dark" ? "/icons/Doggie.svg" : "/icons/Doggie2.svg";
  }
  return (
    <div>
      <NewElement title={"Safe password list"} />
      {data.length === 0 ? (
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
        <TableData elements={data} />
      )}
    </div>
  );
}

export default Home;
