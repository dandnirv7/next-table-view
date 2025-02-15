import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { HeadMetaData } from "./HeadMetaData";

export function SiteHeader() {
  return (
    <>
      <HeadMetaData pathname="/" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
        <div className="container flex h-14 items-center">
          <nav className="flex flex-1 items-center justify-end">
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <Link
                aria-label="GitHub repo"
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubLogoIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <ThemeSwitch />
          </nav>
        </div>
      </header>
    </>
  );
}
