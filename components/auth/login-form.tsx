"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FieldGroup, FieldSet, FieldLabel, Field } from "../ui/field";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema } from "@/lib/schema/user-details.schema";
import { toast } from "sonner";
import { CircleNotchIcon } from "@phosphor-icons/react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Pass form element into FormData
    const formData = new FormData(e.currentTarget);

    // 2. Extract values directly using their name attribute;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 3. Validate data
    const formDataObj = { email, password };
    const result = loginSchema.safeParse(formDataObj);
    const errors = result.error?.flatten().fieldErrors;

    if (errors?.email) {
      toast.error(errors.email[0]);
      setIsLoading(false);
      return;
    }

    if (errors?.password) {
      toast.error(errors.password[0]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Successfully signed in");
      router.push("/dashboard");
    } catch (error) {
      console.error("An unexpected error occurred", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-2 border-foreground">
      <CardHeader className="text-center pt-4">
        <CardTitle className="font-bold text-xl">
          Welcome back to The Hunt!
        </CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="p-5 border-none!">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  placeholder="janedoe@email.com"
                  type="email"
                  required
                  className="border-foreground border-2"
                />
              </Field>

              <Field>
                <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="hover:text-foreground text-foreground/70"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="border-foreground border-2"
                />
              </Field>

              <Field>
                <Button
                  variant="default"
                  type="submit"
                  className="cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircleNotchIcon className="animate-spin" /> Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                <span className="text-center mt-2">
                  Don't have an account? {""}
                  <Link
                    href="/sign-up"
                    className="hover:text-foreground/50 underline transition-colors"
                  >
                    Sign up here
                  </Link>
                </span>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
