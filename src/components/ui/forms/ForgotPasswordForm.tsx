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



const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});



export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;



interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordValues) => Promise<void> | void;
  isLoading?: boolean;
}



export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending…" : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
}