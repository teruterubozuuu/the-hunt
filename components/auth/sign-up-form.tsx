"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FieldGroup, FieldSet, FieldLabel, Field } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { userSchema } from "@/lib/schema/user-details.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // stop page from reloading
    setIsLoading(true);

    // 1. Pass form element into FormData
    const formData = new FormData(e.currentTarget);

    // 2. Extract values directly using their name attribute
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // 3. Validate data
    const formDataObj = {email, username, password};
    const result = userSchema.safeParse(formDataObj);
    const errors = result.error?.flatten().fieldErrors;

    if (errors?.email){
      toast.error(errors.email[0]);
      setIsLoading(false);
      return;
    }

    if (errors?.username){
      toast.error(errors.username[0]);
      setIsLoading(false);
      return;
    }

    if (errors?.password){
      toast.error(errors.password[0]);
      setIsLoading(false);
      return;
    } 


    // 4. Store credentials in SupabaseAuth
    try{
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({email, password, username})
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Successfully created an account");
      router.push("/sign-in")
    } catch (error){
      console.error("Account creation failed", error);
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm border-2 border-foreground">
      <CardHeader className="text-center pt-4">
        <CardTitle className="font-bold text-xl">Start The Hunt</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" placeholder="janedoe@email.com" type="email" required className="border-2 border-foreground" />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" name="username" placeholder="JaneDoe" type="text" required className="border-2 border-foreground" />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" required  className="border-2 border-foreground"/>
              </Field>

              <Field>
                <Button 
                type="submit" 
                variant="default" 
                className="cursor-pointer">
                  Sign up
                </Button>
                <span className="text-center mt-2">Already have an account? {""}
                  <Link href="/sign-in" className="hover:text-foreground/50 underline transition-colors">
                    Sign in here
                  </Link>
                </span>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card >
  )
}

