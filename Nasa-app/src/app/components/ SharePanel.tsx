// components/SharePanel.tsx
export default function SharePanel() {
  return (
    <section className="mt-4 flex gap-2 items-center">
      <span>Share</span>
      {/* Use actual social-icon components */}
      <span className="icon-facebook" />
      <span className="icon-whatsapp" />
      <span className="icon-telegram" />
    </section>
  );
}
