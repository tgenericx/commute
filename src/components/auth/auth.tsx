import { useState } from "react";
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
} from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./login.form";
import { SignUpForm } from "./signup.form";

export const AuthSheet = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [page, setPage] = useState<"signin" | "signup">("signin");

  const togglePage = () => setPage((p) => (p === "signin" ? "signup" : "signin"));

  return (
    <BottomSheet open={open} onClose={onClose}>
      <BottomSheetHeader />

      <BottomSheetBody>
        {page === "signin" ? (
          <SignInForm onSuccess={onClose} />
        ) : (
          <SignUpForm onSuccess={onClose} />
        )}
      </BottomSheetBody>

      <BottomSheetFooter>
        <Button
          type="button"
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
