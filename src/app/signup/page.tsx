import styles from "../login/styles.module.css";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/app/login/user-auth-form";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export default function AuthenticationPage() {
  return (
    <div className={`grid grid-cols-2 ${styles.grd}`}>
      <div className={`flex ${styles.sig}`}>
        <div className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center">
          <ModeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Log in
          </Link>
        </div>
        <div
          className={`mx-auto flex w-full flex-col justify-center space-y-6  ${styles.w}`}
        >
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Your Quix Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose any of the auth providers
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground text-w">
            By clicking continue, you agree to our&nbsp;
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service&nbsp;
            </Link>
            and&nbsp;
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <div
        className={`flex h-screen bg-[url('/login.jpg')] bg-no-repeat bg-center  ${styles.im}`}
      >
        <div className="relative  h-full flex-col  p-10  flex  bold ml-auto">
          <div className="relative z-20 flex items-center text-lg font-medium ">
            <Image
              alt="Signup_page"
              width={500}
              height={500}
              src="/darklogo.png"
              className="w-10"
            />
            Quix.ai
          </div>
        </div>
      </div>
    </div>
  );
}
