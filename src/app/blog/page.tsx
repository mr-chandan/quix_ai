import { MainNav } from "@/components/main-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const page = () => {
  const menuitems = [
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    // {
    //   title: "Documentation",
    //   href: "/docs",
    // },
  ];

  return (
    <div className={` flex min-h-screen flex-col`}>
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={menuitems} />
          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" })
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 h-[80vh]">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Blogs Coming Soon
          </h1>
          <p className="mt-4 text-muted-foreground">
            Stay tuned for updates on our new blog section!
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
