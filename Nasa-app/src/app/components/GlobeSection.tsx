// components/GlobeSection.tsx
import Image from "next/image";

export default function GlobeSection() {
  return (
    <div className="relative">
      <Image
        src="/globe.png"
        alt="Globe"
        width={500}
        height={500}
        className="rounded-full"
      />
      <div className="absolute bottom-10 right-10 bg-yellow-400 text-black p-4 rounded-full font-bold text-lg">
        78
      </div>
    </div>
  );
}
