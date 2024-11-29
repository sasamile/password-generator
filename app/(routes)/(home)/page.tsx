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


function Home() {
  const user = useCurrentUser();
  

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
    }
  };

  useEffect(() => {
    updateData();
  }, [user.id, data]);

  return (
    <div>
      <NewElement title={"Safe password list"} />
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12 ">
          <Image
            src={"/icons/Doggie.svg"}
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
