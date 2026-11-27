import { SignUp } from "@clerk/nextjs";
import { netthouseAppearance } from "@/lib/clerk-theme";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-start justify-center overflow-y-auto bg-slate-50 px-4 py-6 sm:items-center sm:p-6">
      <SignUp
        path="/sign-up"
        appearance={netthouseAppearance as any}
      />
    </div>
  );
}
