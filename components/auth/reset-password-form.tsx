"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSet, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { supabase } from "@/utils/supabase/supabase";
import { ArrowLineLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const [loading, setIsLoading] = useState(false);
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://the-hunt-dusky.vercel.app"
      : "http://localhost:3000";

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/change-password`,
      });

      if (error) {
        toast.error("Failed to reset password");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      toast.success("Reset password link sent to email");
    } catch (error) {
      console.error("An unexpected error occurred", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-2 border-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-xl">
          <Link href="/sign-in" title="Back to Sign In page">
            <ArrowLineLeftIcon />
          </Link>{" "}
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword}>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                type="email"
                name="email"
                className="border-2 border-foreground"
                placeholder="janedoe@email.com"
              />
            </Field>

            <Field>
              <Button variant="default" type="submit">
                Submit
              </Button>
            </Field>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
