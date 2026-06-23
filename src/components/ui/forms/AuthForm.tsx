"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/forms";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";



const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;



type AuthFormProps =
  | {
      mode: "login";
      onSubmit: (values: LoginValues) => Promise<void> | void;
      isLoading?: boolean;
    }
  | {
      mode: "signup";
      onSubmit: (values: SignupValues) => Promise<void> | void;
      isLoading?: boolean;
    };


export function AuthForm({ mode, onSubmit, isLoading = false }: AuthFormProps) {
  const isLogin = mode === "login";

  const form = useForm<LoginValues | SignupValues>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as (values: LoginValues | SignupValues) => void)}
        className="space-y-4"
      >
      
        {!isLogin && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

     
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
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

   
        {!isLogin && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? isLogin
              ? "Signing in…"
              : "Creating account…"
            : isLogin
            ? "Sign In"
            : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}