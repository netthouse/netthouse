import { SignUp } from "@clerk/nextjs";
import { netthouseAppearance } from "@/lib/clerk-theme";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <SignUp
        path="/sign-up"
        appearance={netthouseAppearance as any}
      />
    </div>
  );
}