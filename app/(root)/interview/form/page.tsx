"use client";

import FormFieldInput from "@/components/formField";
import { Button } from "@/components/ui/button";
import { generateInterviewFormSchema } from "@/constants";
import { getCurrentUser } from "@/lib/actions/auth_action";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField } from "@/components/ui/form";

const Page = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof generateInterviewFormSchema>>({
    resolver: zodResolver(generateInterviewFormSchema),
    defaultValues: {
      role: "",
      level: "",
      techStack: "",
      type: "",
      amount: 3,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof generateInterviewFormSchema>) {
    try {
      const user = await getCurrentUser();
      const data = {
        userId: user?.id!,
        resumeUrl: user?.resumeUrl,
        ...values,
      };
      
      const res = await fetch("/api/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (!result.success) {
        toast.error("Interview generation failed");
        return;
      }

      toast.success("Interview generated successfully.");
      router.push("/");
    } catch (error) {
      toast.error("Interview generation failed");
    }
  }

  return (
    <div className="mx-auto">
      <div className="card-border lg:min-w-[566px]">
        <div className="card flex flex-col gap-6 py-14 px-10">
          <div className="flex flex-row gap-2 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">InterviewAce</h2>
          </div>
          <h3 className="text-center capitalize">Generate your perfect interview</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-7 mt-4 form"
            >
              <FormFieldInput
                control={form.control}
                name="role"
                label="Role"
                placeholder="The job role"
              />
              <FormFieldInput
                control={form.control}
                name="techStack"
                label="Tech Stack"
                placeholder="Tech stack relevant to the job"
              />
              <FormFieldInput
                control={form.control}
                name="amount"
                label="No of questions"
                placeholder="3...15"
                type="number"
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-light-100">Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="!bg-dark-200 !rounded-full !min-h-12 !px-5 !text-light-100 w-full">
                          <SelectValue placeholder="The experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid-level">Mid level</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-light-100">Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="!bg-dark-200 !rounded-full !min-h-12 !px-5 !text-light-100 w-full">
                          <SelectValue placeholder="Type of the interview" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                        <SelectItem value="Mixed or Balanced">
                          Mixed/Balanced
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="btn my-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating..." : "Generate"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
