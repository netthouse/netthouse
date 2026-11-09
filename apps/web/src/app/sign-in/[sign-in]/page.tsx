import { SignIn } from "@clerk/nextjs";
import { netthouseAppearance } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <SignIn
        path="/sign-in"
        appearance={netthouseAppearance as any}
      />
    </div>
  );
}