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

export default function LoginForm() {
  return (
    <Card className="w-full max-w-sm border-2 border-foreground">
      <CardHeader className="text-center pt-4">
        <CardTitle className="font-bold text-xl">
          Welcome back to The Hunt!
        </CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="p-5 border-none!">
        <form>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  placeholder="janedoe@email.com"
                  type="text"
                  required
                  className="border-foreground border-2"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="border-foreground border-2"
                />
              </Field>

              <Field>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Input type="checkbox" className="w-3 cursor-pointer" />
                    <span>Remember me</span>
                  </div>
                  <Link href="#">Forgot password?</Link>
                </div>
              </Field>

              <Field>
                <Button
                  variant="default"
                  type="submit"
                  className="cursor-pointer"
                >
                  Sign in
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
