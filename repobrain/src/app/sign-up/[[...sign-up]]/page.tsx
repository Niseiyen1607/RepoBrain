import { SignUp } from "@clerk/nextjs";
import { Zap } from "lucide-react"; // Ou ton logo

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden items-center justify-center bg-[#f8fafc] lg:flex">
        <div className="max-w-md p-8 text-center">
          <img
            src="/undraw_sign-up.svg"
            alt="Illustration"
            className="mb-8 h-64 w-full object-contain"
          />
          <h2 className="text-3xl font-bold text-slate-900">
            Protection that starts on day one
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            AI-powered GitHub analytics to help you build faster and more
            securely.
          </p>

          <div className="mt-8 space-y-3 text-left">
            {[
              "Continuous testing",
              "Identity-first access",
              "Real-time detection",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2 text-slate-700"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6c47ff]/10 text-[#3a64f2]">
                  <Zap className="size-3 fill-current" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <span className="text-2xl font-bold text-[#3a64f2]">RepoBrain</span>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-none",
                formButtonPrimary:
                  "bg-[#6c47ff] hover:bg-[#5a3ae0] text-sm normal-case shadow-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
