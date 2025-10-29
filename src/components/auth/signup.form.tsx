import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  SignupMutation,
  SignupMutationVariables,
  SignupDocument,
} from "@/graphql/graphql";

const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(50, { message: "Username must be less than 50 characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email address" })
      .max(255, { message: "Email must be less than 255 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password must be less than 128 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
  switchToLogin?: () => void;
}

export const SignUpForm: React.FC<SignupFormProps> = ({
  onSuccess,
  switchToLogin,
}) => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { loginSuccess } = useAuth();

  const [signup, { loading }] = useMutation<
    SignupMutation,
    SignupMutationVariables
  >(SignupDocument);

  const onSubmit = async (data: SignupFormData) => {
    console.log("🚀 Signup started...");
    console.log("🧾 Form Data:", data);

    try {
      console.log("📡 Sending signup mutation...");
      const { data: res } = await signup({
        variables: {
          data: {
            email: data.email,
            username: data.username,
            password: data.password,
          },
        },
      });

      console.log("📬 Received response:", res);

      if (res?.createUser?.accessToken && res.createUser.refreshToken) {
        console.log("🔐 Tokens received:");
        console.log("   - accessToken:", !!res.createUser.accessToken);
        console.log("   - refreshToken:", !!res.createUser.refreshToken);

        loginSuccess(res.createUser.accessToken, res.createUser.refreshToken);

        toast.success("🎉 Signup successful!");
        console.log("✅ Signup completed successfully!");
        onSuccess();
      } else {
        console.error("⚠️ Signup failed: No tokens returned", res);
        toast.error("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("💥 Signup error:", err);
      toast.error("Signup failed due to an unexpected error.");
    } finally {
      console.log("🏁 Signup process finished.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="john_doe"
                  {...field}
                  className="bg-neutral-800 border-neutral-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  className="bg-neutral-800 border-neutral-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="bg-neutral-800 border-neutral-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="bg-neutral-800 border-neutral-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Switch to Login */}
        {switchToLogin && (
          <Button
            type="button"
            variant="ghost"
            onClick={switchToLogin}
            className="w-full text-sm text-neutral-400 hover:text-neutral-200"
          >
            Already have an account? Sign in
          </Button>
        )}
      </form>
    </Form>
  );
};
