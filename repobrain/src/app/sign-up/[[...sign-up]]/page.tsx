import { SignUp } from "@clerk/nextjs";
import { Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
        <img
          src="/auth-gradient.png"
          alt="Background Gradient"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute top-10 left-10 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white shadow-md">
            <Zap className="size-5 fill-current text-[#3a64f2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            RepoBrain
          </span>
        </div>

        <div className="relative z-10 max-w-md p-8 text-center">
          <img
            src="/undraw_sign-up.svg"
            alt="Illustration"
            className="mb-10 h-72 w-full object-contain drop-shadow-2xl"
          />
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Protection starts here
          </h2>
          <p className="mt-4 text-lg text-blue-100/90">
            Join RepoBrain today and start analyzing your GitHub repositories
            with the power of AI.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {[
              "Continuous repository indexing",
              "Identity-first security access",
              "Real-time threat detection",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                  <Zap className="size-3 fill-current" />
                </div>
                <span className="text-sm font-medium text-white/90">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-10 flex flex-col items-center lg:hidden">
            <Zap className="mb-2 size-10 fill-current text-[#3a64f2]" />
            <span className="text-3xl font-bold text-[#3a64f2]">RepoBrain</span>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "shadow-none border-none bg-transparent w-full max-w-[400px]",
                formFieldInput:
                  "h-11 border-slate-200 focus:border-[#3a64f2] focus:ring-1 focus:ring-[#3a64f2]",
                formButtonPrimary:
                  "bg-[#3a64f2] hover:bg-[#2d50c1] h-11 text-sm font-bold normal-case shadow-none",
                headerTitle: "text-2xl font-bold text-slate-900",
                headerSubtitle: "text-slate-500",
                footerActionLink:
                  "text-[#3a64f2] hover:text-[#2d50c1] font-semibold",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
