// components/FooterInfo.tsx
export default function FooterInfo() {
  return (
    <footer className="flex justify-between items-center p-6 text-gray-400 text-sm">
      <div className="flex gap-4">
        <span>Share:</span>
        <span>🌐</span>
        <span>📱</span>
        <span>💬</span>
      </div>
      <div>
        <p>X: 5.404578</p>
        <p>Y: -73.828177</p>
      </div>
    </footer>
  );
}
