import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { z } from "zod";

const REGISTER_MUTATION = gql`
  mutation Signup($data: CreateUserInput!) {
    createUser(input: $data) {
      accessToken
      refreshToken
    }
  }
`;

type RegisterMutation = {
  createUser: {
    accessToken: string;
    refreshToken: string;
  };
};

type RegisterVariables = {
  data: {
    username: string;
    email: string;
    password: string;
  };
};

// Enhanced password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one capital letter")
  .regex(/[a-z]/, "Password must contain at least one small letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { loginSuccess } = useAuth();
  const [register, { loading }] = useMutation<
    RegisterMutation,
    RegisterVariables
  >(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    try {
      const { data } = await register({
        variables: {
          data: { username, email, password },
        },
      });

      if (data?.createUser?.accessToken) {
        await loginSuccess(
          data.createUser.accessToken,
          data.createUser.refreshToken,
        );
        toast.success("Account created successfully!");
        onSuccess();
      }
    } catch (error: any) {
      const message = error.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-sm text-muted-foreground mt-2">Join Buddy today</p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="sr-only">
              Registration Information
            </FieldLegend>
            <FieldDescription className="sr-only">
              Enter your username, email and create a password to create your
              account
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="register-username">Username</FieldLabel>
                <Input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loading}
                  required
                />
                {errors.username && (
                  <FieldDescription className="text-destructive">
                    {errors.username}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password}
                  </FieldDescription>
                )}
                <FieldDescription>
                  Password must be at least 8 characters with:
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>One capital letter (A-Z)</li>
                    <li>One small letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (!@#$%^&* etc.)</li>
                  </ul>
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="register-confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                {errors.confirmPassword && (
                  <FieldDescription className="text-destructive">
                    {errors.confirmPassword}
                  </FieldDescription>
                )}
                <FieldDescription>
                  Enter your password again to confirm
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal" className="pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <div className="text-center text-sm mt-6">
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-primary hover:underline font-medium"
          type="button"
          disabled={loading}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
