"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Search } from "lucide-react";

const formSchema = z.object({
  input: z.string().min(2).max(100),
});

function SearchBar() {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    router.push(`/search/${values.input}`);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative w-full">
                  <Input
                    placeholder="Search for movies..."
                    {...field}
                    className="w-full h-12 sm:h-14 md:h-16 pl-12 pr-6 text-base sm:text-lg md:text-xl bg-gray-800/50 border-gray-700 focus:border-gray-600 rounded-lg"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default SearchBar;
