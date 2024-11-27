import React from "react";
import { DataTable } from "./data-table";
import { Element } from "@prisma/client";
import { columns } from "./columns";

export type TableDataProps = {
  elements: Element[];
};

function TableData(props: TableDataProps) {
  const { elements } = props;
  return (
    <div className="py-10">
      <DataTable columns={columns} data={elements} />
    </div>
  );
}

export default TableData;
