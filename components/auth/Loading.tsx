import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Cambié la imagen por un texto que representa la empresa */}
        <div className=" flex justify-center gap-3 items-center">
          <Image
            src="/image/logo.avif"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full  h-12 aspect-video object-cover"
          />
          <h2 className="text-2xl font-bold text-white">SasCode</h2>
        </div>
        <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden ">
          {/* Asegúrate de que la animación se vea bien */}
          <div className="h-full bg-blue-600 animate-progress"></div>
        </div>
      </div>
    </div>
  );
}
