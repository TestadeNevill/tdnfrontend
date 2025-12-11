import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Contact() {
  const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID?.trim();

  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'sending' | 'ok' | 'fail'
  const navigate = useNavigate();
  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const e = {};
    if (values.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Enter a valid email address.";
    if (values.message.trim().length < 10)
      e.message = "Please enter at least 10 characters.";
    return e;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    if (!FORMSPREE_ID) {
      setStatus("fail");
      setErrors({ form: "Missing VITE_FORMSPREE_ID. Add it and redeploy." });
      return;
    }

    setStatus("sending");

    const data = new FormData();
    for (const [k, v] of Object.entries(values)) data.append(k, v);
    data.append("_subject", values.subject || `New message from ${values.name}`);
    data.append("_gotcha", values.company); // honeypot

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setValues({ name: "", email: "", subject: "", message: "", company: "" });
        setErrors({});
          navigate("/thanks");  
      } else {
        setStatus("fail");
        setErrors({
          form:
            body?.errors?.map((e) => e.message).join(" ") ||
            "Could not send right now. Try again or email directly.",
        });
      }
    } catch {
      setStatus("fail");
      setErrors({ form: "Network error. Try again or email directly." });
    }
  }

  return (
    <section className=" aspect-square container-page">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact</h2>
  <p className="text-gray-700 mb-6 text-2xl font-semibold">Let&apos;s Connect!</p>

      {!FORMSPREE_ID && (
        <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 p-3 text-sm">
          <strong>Heads up:</strong> <code>VITE_FORMSPREE_ID</code> isn’t set.
          Add it in Vercel (or <code>.env.local</code>) and redeploy.
        </div>
      )}

<form
  onSubmit={onSubmit}
  className="block w-full mx-auto space-y-4"
  noValidate
>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={values.name}
            onChange={onChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject (optional)
          </label>
          <input
            name="subject"
            value={values.subject}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            rows="6"
            value={values.message}
            onChange={onChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
          {errors.message && (
            <p className="text-sm text-red-600 mt-1">{errors.message}</p>
          )}
        </div>
        

        {/* Honeypot (hidden) */}
        <div className="hidden" aria-hidden="true">
          <label>Company</label>
          <input
            name="company"
            value={values.company}
            onChange={onChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center rounded-md bg-green-700 px-4 py-2 text-white font-semibold disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>

        {status === "ok" && (
          <p className="text-sm text-green-700 mt-3" role="status">
            Thanks! Your message has been sent.
          </p>
        )}
        {status === "fail" && FORMSPREE_ID && (
          <p className="text-sm text-red-600 mt-3" role="alert">
            Could not send right now. Try again or email me directly.
          </p>
        )}
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Prefer email?{" "}
        <a className="link" href="mailto:testadenevill@gmail.com">
          testadenevill@gmail.com
        </a>
      </p>
    </section>
  );
}
