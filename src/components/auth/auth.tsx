import { BottomSheet, BottomSheetBody, BottomSheetFooter } from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./login.form";
import { SignUpForm } from "./signup.form";
import { useAuthSheet } from "@/contexts/auth-sheet";

export const AuthSheet = () => {
  const { open, closeAuth, page, setPage } = useAuthSheet();

  const togglePage = () => setPage(page === "signin" ? "signup" : "signin");

  return (
    <BottomSheet open={open} onClose={closeAuth}>

      <BottomSheetBody>
        {page === "signin" ? (
          <SignInForm onSuccess={closeAuth} />
        ) : (
          <SignUpForm onSuccess={closeAuth} />
        )}
      </BottomSheetBody>

      <BottomSheetFooter>
        <Button
          variant="ghost"
          className="w-full text-sm text-neutral-400 hover:text-neutral-200"
          onClick={togglePage}
        >
          {page === "signin"
            ? "Don’t have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </BottomSheetFooter>
    </BottomSheet>
  );
};
