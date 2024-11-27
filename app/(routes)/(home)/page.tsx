import { currentUser } from "@/lib/auth-user";
import NewElement from "./components/new-element";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import TableData from "@/components/TableData/table-data";

async function Home() {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const data = await db.element.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div>
      <NewElement />
      <TableData elements={data} />
    </div>
  );
}

export default Home;
