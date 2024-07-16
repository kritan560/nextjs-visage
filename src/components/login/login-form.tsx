"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { LinkForgotPassword } from "@/links/links";
import { LoginFormSchema, LoginFormSchemaType } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { VisageFormItem } from "../visage-form-item";

export function LoginForm() {
  // 1. Define your form.
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: LoginFormSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <VisageFormItem
              field={field}
              inputPlaceholder="Enter Your Email"
              inputType="email"
              labelName="Email"
              showLabel
              inputTextSize="large"
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <VisageFormItem
              field={field}
              inputPlaceholder="Password"
              inputType="password"
              labelName="Password"
              showLabel
              inputTextSize="large"
            />
          )}
        />

        <div>
          <Link
            href={LinkForgotPassword}
            className="text-stone-500 font-medium border-b-2 w-fit border-dashed border-stone-300 cursor-pointer">
            Forgot Your Password?
          </Link>
        </div>

        <Button
          className="w-full"
          variant={"visage"}
          size={"visage"}
          type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
