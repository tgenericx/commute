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
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { z } from "zod";

const LOGIN_MUTATION = gql`
  mutation Login($userData: LoginInput!) {
    login(input: $userData) {
      accessToken
      refreshToken
    }
  }
`;

type LoginMutation = {
  login: {
    accessToken: string;
    refreshToken: string;
  };
};

type LoginVariables = {
  userData: {
    email?: string;
    username?: string;
    password: string;
  };
};

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

// Helper function to detect if input is email or username
const detectInputType = (
  input: string,
): { isEmail: boolean; value: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = emailRegex.test(input);
  return { isEmail, value: input };
};

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});

  const { loginSuccess } = useAuth();
  const [login, { loading }] = useMutation<LoginMutation, LoginVariables>(
    LOGIN_MUTATION,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ emailOrUsername, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        emailOrUsername: fieldErrors.emailOrUsername?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    try {
      const { isEmail, value } = detectInputType(emailOrUsername);

      const variables: LoginVariables = {
        userData: {
          password,
        },
      };

      // Set either email or username based on input type, but not both
      if (isEmail) {
        variables.userData.email = value;
        variables.userData.username = undefined;
      } else {
        variables.userData.username = value;
        variables.userData.email = undefined;
      }

      const { data } = await login({
        variables,
      });

      if (data?.login?.accessToken) {
        await loginSuccess(data.login.accessToken, data.login.refreshToken);
        toast.success("Welcome back!");
        onSuccess();
      }
    } catch (error: any) {
      const message = error.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="sr-only">Login Information</FieldLegend>
            <FieldDescription className="sr-only">
              Enter your email or username and password to access your account
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login-email-or-username">
                  Email or Username
                </FieldLabel>
                <Input
                  id="login-email-or-username"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="you@example.com or yourusername"
                  disabled={loading}
                  required
                />
                {errors.emailOrUsername && (
                  <FieldDescription className="text-destructive">
                    {errors.emailOrUsername}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Input
                  id="login-password"
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
                  Enter your password to sign in
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal" className="pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <div className="text-center text-sm mt-6">
        <span className="text-muted-foreground">Don't have an account? </span>
        <button
          onClick={onSwitchToRegister}
          className="text-primary hover:underline font-medium"
          type="button"
          disabled={loading}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};
