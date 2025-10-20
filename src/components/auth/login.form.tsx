import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginDocument, LoginMutation, LoginMutationVariables } from "@/graphql/graphql";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const SignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login({
        variables: {
          userData: {
            email: data.identifier.includes("@") ? data.identifier : undefined,
            username: !data.identifier.includes("@") ? data.identifier : undefined,
            password: data.password,
          },
        },
      });

      const auth = res.data?.login;
      if (auth?.accessToken && auth?.refreshToken) {
        localStorage.setItem("accessToken", auth.accessToken);
        localStorage.setItem("refreshToken", auth.refreshToken);
        toast.success("Logged in successfully!");
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message ?? "Login failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com or username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};
