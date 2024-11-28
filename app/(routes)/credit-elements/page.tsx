"use client";
import React, { useEffect, useState } from "react";
import NewElement from "../(home)/components/new-element";
import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";
import { fetchData } from "@/actions/element";
import { Element } from "@prisma/client";
import CardTable from "@/components/TableData/card-table";

function CrediElementListPage() {
  const user = useCurrentUser();

  if (!user) {
    return redirect("/");
  }
  const [data, setData] = useState<Element[]>([]);

  const updateData = async () => {
    const newData = await fetchData(user.id);
    if (Array.isArray(newData)) {
      const filteredData = newData.filter(
        (item) => item.typeElement === "card"
      );
      setData(filteredData);
    } else {
      console.error("Error fetching data:", newData.error);
    }
  };

  useEffect(() => {
    updateData();
  }, [user.id, data]);

  return (
    <div>
      <NewElement title={"Credit Card List"} />
      <CardTable elements={data} />
    </div>
  );
}

export default CrediElementListPage;
