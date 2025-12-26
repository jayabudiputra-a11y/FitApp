import React, { useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* ======================
    UI COMPONENTS
====================== */

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    className="w-full bg-emerald-700 text-white px-4 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]
               hover:bg-emerald-800 disabled:bg-gray-400 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
    {...props}
  >
    {children}
  </button>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all text-gray-900 placeholder:text-gray-400"
    {...props}
  />
);

/* ======================
    SIGN UP FORM
====================== */

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pending_subscribe_email");
    if (pendingEmail) {
      setFormData((prev) => ({ ...prev, email: pendingEmail }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await authApi.signUp({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      if (user) {
        localStorage.removeItem("pending_subscribe_email");
        setSuccess(true);

        toast.success("Registration Successful!", {
          description: `Hi ${formData.name}, welcome to Fitapp.`
        });

        setTimeout(() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/");
          }

          setTimeout(() => {
            window.location.reload();
          }, 200);
        }, 2000);
      }
    } catch (err: any) {
      console.error("SIGN UP ERROR:", err);
      const errorMessage =
        err?.message || "Something went wrong while creating your account.";
      setError(errorMessage);
      toast.error("Sign-up Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-12 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tighter text-emerald-900 leading-none">
          Success!
        </h2>

        <p className="mt-3 text-emerald-800 font-bold text-sm">
          Your account is now active. Get ready to share your best comments!
        </p>

        <div className="mt-8 flex justify-center gap-1">
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            Join the Club
          </h2>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-2">
            Instant sign-up & start the discussion
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-[10px] font-black uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">
              Full Name
            </label>
            <Input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">
              Email Address
            </label>
            <Input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Activate Account & Comment"}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 mt-8">
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
            No Password • No Hassle
          </p>
          <div className="h-1 w-6 bg-emerald-200 rounded-full"></div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
