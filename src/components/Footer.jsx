export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-12">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
        <p className="text-sm text-gray-500 text-center md:text-left">
          © {new Date().getFullYear()} Testa de Nevill • Vite + React • Deployed on Vercel
        </p>
      </div>
    </footer>
  )
}
