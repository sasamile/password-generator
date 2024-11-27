"use client";
import React, { useTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/actions/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function FormLogin() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      startTransition(async () => {
        const response = await login(values);

        if (response?.error) {
          toast.error(response.error);
        }
        if (!response?.error) {
          form.reset();
          toast.success("Success");
          window.location.reload();
        }
      });
    } catch (error) {
      toast.error("There was a problem with your application.");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="border-[#525252] py-5 font-acme"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    field={field}
                    isSubmitting={isSubmitting}
                    className="border-[#525252] py-5"
                  />
                </FormControl>
                <FormDescription className="text-[13.5px]">
                  The password must be a minimum of 8 characters, including at
                  least 1 letter, 1 number and 1 special character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending && isSubmitting && isValid}
            className="w-full "
          >
            {isSubmitting && <Loader2 className="h-5 w-5 mr-3 animate-spin" />}
            Sign-in
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default FormLogin;
