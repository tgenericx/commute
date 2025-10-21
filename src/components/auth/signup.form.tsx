import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

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
import { MiniMediaData } from "@/components/media";
import { useUploadMedia } from "@/hooks/useUploadMedia";
import {
  SignupMutation,
  SignupMutationVariables,
  SignupDocument,
  ResourceType,
} from "@/graphql/graphql";
import MediaThumbnail from "../media/thumbnail";

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
  const { uploadMedia, isUploading } = useUploadMedia();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const [signup, { loading }] = useMutation<
    SignupMutation,
    SignupMutationVariables
  >(SignupDocument);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [uploaded] = await uploadMedia([file]);
      setAvatarUrl(uploaded.secureUrl);
    } catch (err) {
      console.error(err);
      toast.error("Avatar upload failed");
    }
  };

  const avatarMini: MiniMediaData | null = avatarUrl
    ? {
      id: "avatar",
      secureUrl: avatarUrl,
      resourceType: ResourceType.Image,
    }
    : null;

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { data: res } = await signup({
        variables: { ...data, avatar: avatarUrl },
      });

      if (res?.createUser?.accessToken && res.createUser.refreshToken) {
        localStorage.setItem("accessToken", res.createUser.accessToken);
        localStorage.setItem("refreshToken", res.createUser.refreshToken);
        toast.success("Signup successful!");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar Upload */}
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-neutral-200 mb-4">
          {avatarMini ? (
            <MediaThumbnail
              {...avatarMini}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-neutral-400">
              <Upload className="w-6 h-6" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          )}
        </div>

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
        <Button
          type="submit"
          className="w-full"
          disabled={loading || isUploading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
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
