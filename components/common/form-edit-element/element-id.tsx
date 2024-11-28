"use client";
import { fetchDataElementEdit } from "@/actions/element";
import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Element } from "@prisma/client";
import ElementStepper from "@/app/(routes)/(home)/components/element-cretion-stepper";

function ElementIdPage({
  elementID,
  isOpen,
  Open,
}: {
  elementID: string;
  isOpen: (value: boolean) => void;
  Open: boolean;
}) {
  const user = useCurrentUser();
  const [data, setData] = useState<Element | null>(null);

  if (!user) {
    return redirect("/");
  }

  const updateData = async () => {
    const newData = await fetchDataElementEdit(elementID);
    // Check if newData is an object and has the expected properties
    if (newData && typeof newData === "object" && "id" in newData) {
      setData(newData);
    } else {
      console.error("Error fetching data:", newData);
    }
  };

  useEffect(() => {
    updateData();
  }, [user.id]);

  return (
    <div>
      {data && (
        <ElementStepper dataElement={data} open={Open} isOpen={isOpen} />
      )}
    </div>
  );
}

export default ElementIdPage;
