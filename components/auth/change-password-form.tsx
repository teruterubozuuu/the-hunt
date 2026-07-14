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
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("new-password") as string;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error("Failed to update password");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      toast.success("Password updated successfully");
      router.push("/sign-in");
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
        <CardTitle className="font-bold text-xl">Change Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword}>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                type="password"
                name="new-password"
                id="new-password"
                className="border-2 border-foreground"
              />
            </Field>

            <Field>
              <Button variant="default" type="submit">
                {loading ? (
                  <>
                    <CircleNotchIcon className="animate-spin" /> Updating....
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </Field>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
