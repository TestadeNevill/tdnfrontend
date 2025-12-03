export default function Donations() {
  return (
    <div className="max-w-xl mx-auto bg-white border-2 border-green-200 rounded-xl p-6 text-center">
      <h2 className="text-green-800 text-2xl font-bold mb-2">Support This Project</h2>

      <p className="text-green-800 mb-4">
        Your donations help me create more content, tools, and updates.  
        Thank you for supporting my work.
      </p>

      <a
        href="https://buy.stripe.com/7sYaEYbjA7vT8aifx86Na03"
        target="_blank"
        className="inline-block px-5 py-3 border-2 border-green-400 text-green-800 rounded-lg font-semibold hover:bg-green-100 transition"
      >
        Donate with Stripe
      </a>
    </div>
  );
}
