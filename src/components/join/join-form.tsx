"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VisageFormItem } from "../visage/visage-form-item";
import { JoinFormSchema, JoinFormSchemaType } from "@/schemas/joinFormSchema";

export function JoinForm() {
  // 1. Define your form.
  const form = useForm<JoinFormSchemaType>({
    resolver: zodResolver(JoinFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: JoinFormSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
        <div className="block items-center gap-x-6 space-y-10 md:flex md:space-y-0">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputPlaceholder="Enter Your First Name"
                inputType="text"
              />
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputPlaceholder="Enter Your Last Name"
                inputType="text"
              />
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <VisageFormItem
              field={field}
              inputPlaceholder="Enter Your Email"
              inputType="email"
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
            />
          )}
        />
        <Button
          className="w-full"
          variant={"visage"}
          size={"visage"}
          type="submit"
        >
          Share your content on visage
        </Button>
      </form>
    </Form>
  );
}
