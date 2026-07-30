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
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({email})
      });

      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Reset password link sent to email");
    } catch (error) {
      console.error("An unexpected error occurred", error);
    }
  };

  return (
    <Card className="w-full max-w-sm border-2 border-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-xl">
          <Link href="/sign-in" title="Back to Sign In page">
            <ArrowLineLeftIcon className="text-foreground/70 hover:text-foreground"/>
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
