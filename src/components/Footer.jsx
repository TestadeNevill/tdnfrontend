export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-12">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Testa De Nevill • Vite + React • Deployed on Vercel
      </div>
    </footer>
  )
}
