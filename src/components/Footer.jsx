import { useLocation } from "react-router-dom";

export default function Footer() {
  const { pathname } = useLocation();
  const isLabs = pathname.startsWith("/labs");

  return (
    <footer
      className={[
        "border-t border-gray-200",
        isLabs ? "mt-0 border-labs-border bg-labs-bg" : "mt-12",
      ].join(" ")}
    >
      <div className="site-container py-8">
        <p className="text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Testa de Nevill • Vite + React • Deployed on Vercel
        </p>
      </div>
    </footer>
  );
}
