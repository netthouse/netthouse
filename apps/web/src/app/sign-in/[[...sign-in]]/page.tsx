import { SignIn } from "@clerk/nextjs";
import { netthouseAppearance } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-50">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={netthouseAppearance as any}
      />
    </div>
  );
}
