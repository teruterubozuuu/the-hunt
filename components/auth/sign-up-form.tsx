"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FieldGroup, FieldSet, FieldLabel, Field } from "../ui/field";
import { Input } from "../ui/input";

export default function SignUpForm() {
  return (
    <Card className="w-full max-w-sm border-2 border-foreground">
      <CardHeader className="text-center pt-4">
        <CardTitle className="font-bold text-xl">Start The Hunt</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <form>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" placeholder="janedoe@email.com" type="text" required className="border-2 border-foreground" />
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
                <Button type="submit" variant="default" className="cursor-pointer">Sign up</Button>
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

