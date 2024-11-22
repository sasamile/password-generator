"use client"
import React from "react";
import toast from "react-hot-toast";

function Home() {
  return (
    <div>
      <button onClick={() => toast.success("Toast Creado exitosamente")}>
        Click Toast
      </button>
    </div>
  );
}

export default Home;
