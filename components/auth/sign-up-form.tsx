"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FieldGroup, FieldSet, FieldLabel, Field } from "../ui/field";
import { Input } from "../ui/input";

export default function SignUpForm() {
  return (
    <Card className="w-full max-w-sm border border-primary">
      <CardHeader className="text-center">
        <CardTitle className="font-semibold text-lg">Start The Hunt</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" placeholder="janedoe@email.com" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" name="username" placeholder="JaneDoe" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>

              <Field>
                <Button variant="outline" type="submit" className="cursor-pointer text-foreground border-primary!">Sign up</Button>
                <span className="text-center mt-2">Already have an account? {""}
                  <Link href="/sign-in" className="hover:text-primary underline transition-colors">
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

