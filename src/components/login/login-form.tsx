"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { LinkForgotPassword } from "@/links/visage-links";
import {
  LoginFormSchema,
  LoginFormSchemaType,
} from "@/schemas/loginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { VisageFormItem } from "../visage/visage-form-item";

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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            className="w-fit cursor-pointer border-b-2 border-dashed border-stone-300 font-medium text-stone-500"
          >
            Forgot Your Password?
          </Link>
        </div>

        <Button
          className="w-full"
          variant={"visage"}
          size={"visage"}
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
