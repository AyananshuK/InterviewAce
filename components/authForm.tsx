"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./formField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth_action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);
	const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const {name, email, password} = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email: email,
          password: password
        })
        
        if(!result?.success){
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
				router.push('/sign-in');
      } else {
        const {email, password} = values;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        if(!idToken){
          toast.error("Sign in failed.");
          return;
        }
        await signIn({
          email, idToken
        })

        toast.success("Signed in successfully.");
				router.push('/');
      }
    } catch (error) {
      toast.error(`There was an error: ${error}`);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="card flex flex-col gap-6 py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">InterviewAce</h2>
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-7 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="email@example.com"
							type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="password"
							type="password"
            />
            <Button type="submit" className="btn" disabled={isSubmitting}>
              {isSignIn ? "Sign in" : "Sign up"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Do not have an account?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
