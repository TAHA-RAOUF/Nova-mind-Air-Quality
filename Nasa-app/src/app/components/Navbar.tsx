// components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#0c1539]">
      <div className="flex gap-6 text-gray-300">
        <a href="#">Air Quality</a>
        <a href="#">Air Monitors</a>
        <a href="#">Discover</a>
      </div>
      <div className="text-xl font-bold">🌍 Aerexus</div>
      <div className="flex gap-6 text-gray-300">
        <a href="#">About</a>
        <a href="#">Technology</a>
        <button className="bg-white text-black px-4 py-2 rounded-full">
          Get Started
        </button>
      </div>
    </nav>
  );
}
