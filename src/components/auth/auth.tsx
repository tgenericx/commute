import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./login.form";
import { SignUpForm } from "./signup.form";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

export const AuthSheetContent = ({
  page: initialPage = "signin",
  onClose,
}: {
  page?: "signin" | "signup";
  onClose: () => void;
}) => {
  const [page, setPage] = useState<"signin" | "signup">(initialPage);

  const togglePage = () => setPage(page === "signin" ? "signup" : "signin");

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4">
        {page === "signin" ? (
          <SignInForm onSuccess={onClose} />
        ) : (
          <SignUpForm onSuccess={onClose} />
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full text-sm text-neutral-400 hover:text-neutral-200"
        onClick={togglePage}
      >
        {page === "signin"
          ? "Don’t have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </div>
  );
};

export const AuthSheet = () => {
  useRegisterSheet("auth", (props, onClose) => (
    <AuthSheetContent {...props} onClose={onClose} />
  ));
  return null;
};
