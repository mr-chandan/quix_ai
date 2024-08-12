import * as React from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 mt-32">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <img src="logo.png" className="w-7" />
          <p className="text-center text-sm leading-loose md:text-left">
            Made with 💛 in India. Built by{" "}
            <a
              href={"/"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Chandan
            </a>
            . For enquiries contact{" "}
            <a
              href="https://twitter.com/mygodlon"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              twitter
            </a>
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
