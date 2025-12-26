import React, { useState } from "react";
import { authApi } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

// OPTIMASI: Warna emerald ditingkatkan ke 700 untuk kontras teks putih yang lebih baik
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

// OPTIMASI: Placeholder dipergelap agar memenuhi standar WCAG (minimal ratio 4.5:1)
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all text-gray-900 text-center text-lg placeholder:text-gray-400"
    {...props}
  />
);

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await authApi.signInWithEmailOnly(email);

      if (result?.session || result?.user) {
        toast.success("Signed in successfully!", {
          description: "Welcome back to Fitapp."
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
        }, 1000);
      }
    } catch (err: any) {
      const msg = err.message?.includes("Invalid login credentials")
        ? "Email not found. Please sign up if you don't have an account."
        : "Sign-in failed. Please check your connection or email.";

      setError(msg);
      toast.error("Sign-in failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
            Welcome Back
          </h2>

          {/* OPTIMASI: Warna emerald dipertegas */}
          <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-[0.2em] mt-2">
            Sign in to continue the discussion
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {/* OPTIMASI: Label dipergelap dari gray-400 ke gray-600 */}
          <label
            htmlFor="email"
            className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1"
          >
            Email Address
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading || !email}>
            {loading ? "Verifying..." : "Sign In Now"}
          </Button>
        </div>

        <div className="text-center mt-6">
          {/* OPTIMASI: Text gray-400 dipergelap ke gray-600 */}
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">
            Don't have an account?
            <Link
              to="/signup"
              className="text-emerald-700 font-black hover:underline not-italic ml-1"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="flex justify-center gap-1.5 pt-4">
          <div className="h-1 w-1 bg-gray-300 rounded-full" />
          <div className="h-1 w-4 bg-emerald-600 rounded-full" />
          <div className="h-1 w-1 bg-gray-300 rounded-full" />
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
