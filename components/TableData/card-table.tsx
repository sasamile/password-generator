import React from "react";
import { DataTable } from "./data-table";
import { Element } from "@prisma/client";
import { columnsCard } from "./columns-card";


export type TableDataProps = {
  elements: Element[];
};

function CardTable(props:TableDataProps ) {
  const { elements } = props;
  return (
    <div className="">
      <DataTable columns={columnsCard} data={elements} />
    </div>
  );
}

export default CardTable;
