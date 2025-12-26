import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    localStorage.setItem("pending_subscribe_email", email);

    navigate("/signup");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
        aria-label="Email address for newsletter"
        className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-emerald-600 outline-none transition-all placeholder:text-neutral-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-emerald-700 text-white font-black uppercase text-[10px] tracking-[.15em] rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 active:scale-95 whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterForm;