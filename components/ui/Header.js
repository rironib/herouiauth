"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { atomic_age } from "@/config/fonts";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Skeleton,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { RiCloseLine, RiMenuLine } from "react-icons/ri";
import { signOut, useSession } from "next-auth/react";

export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  return (
    <>
      <header className="bg-default-50 bg-opacity-80 sticky top-0 right-0 left-0 z-50 shadow-sm backdrop-blur-md">
        <nav className="grid h-14 grid-cols-2 items-center justify-between px-3 sm:px-4 md:h-16 md:px-5 lg:grid-cols-3 lg:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-default-700 z-50 text-2xl lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <RiCloseLine /> : <RiMenuLine />}
            </button>
            {/* Logo + Brand */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                color="foreground"
                className="flex items-center gap-2"
              >
                <AcmeLogo />
                <h1
                  className={`${atomic_age.className} hidden text-xl font-bold sm:block md:text-2xl`}
                >
                  {siteConfig.siteName}
                </h1>
              </Link>
            </div>
          </div>
          {/* Desktop Links */}
          <div className="hidden items-center justify-center gap-6 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Right Controls */}
          <div className="flex items-center justify-end gap-4">
            <ThemeSwitch />
            {status === "loading" ? (
              <Skeleton className="flex h-8 w-8 rounded-full" />
            ) : session?.user || session?.user?.email ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name={session?.user?.name}
                    size="sm"
                    src={session?.user?.image || "/avatars/user.png"}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{session.user.email}</p>
                  </DropdownItem>
                  {session.user.isAdmin && (
                    <DropdownItem href="/admin" key="admin" color="primary">
                      Admin Panel
                    </DropdownItem>
                  )}
                  <DropdownItem href="/dashboard" key="dashboard">
                    Dashboard
                  </DropdownItem>
                  <DropdownItem
                    onPress={handleLogout}
                    key="logout"
                    color="danger"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <div className="hidden items-center gap-3 lg:flex">
                <Button
                  as={Link}
                  color="primary"
                  href="/auth/login"
                  variant="ghost"
                  radius="sm"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  color="primary"
                  radius="sm"
                  href="/auth/register"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`bg-default-100 fixed top-0 left-0 z-30 h-full min-w-[240px] transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col justify-between px-4 pt-16 pb-4 md:pt-18">
          {/* Navigation Links */}
          <div>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                color={pathname === item.href ? "primary" : "foreground"}
                className="hover:text-primary block py-2 text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="mt-auto flex flex-col gap-3">
            {!session?.user && (
              <div className="flex flex-col gap-3">
                <Button
                  fullWidth
                  as={Link}
                  color="primary"
                  href="/auth/login"
                  variant="ghost"
                  radius="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  as={Link}
                  color="primary"
                  href="/auth/register"
                  radius="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
