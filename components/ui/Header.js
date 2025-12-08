"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { atomic_age } from "@/config/fonts";
import { Avatar, Button, Link, Skeleton } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  RiAccountCircleLine,
  RiCloseLine,
  RiHome4Line,
  RiLogoutCircleRLine,
  RiMenuLine,
  RiShieldUserLine,
} from "react-icons/ri";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
              <Avatar
                size="sm"
                className="border-default-400 dark:border-default-400 hover:border-primary cursor-pointer rounded-full border-2 transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />
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

      {/* User Menu */}
      {session?.user && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 ${isUserMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={() => setIsUserMenuOpen(false)}
          />
          <div
            className={`bg-default-100 fixed top-0 right-0 z-30 h-max min-w-[240px] transform rounded-b-md transition-transform duration-300 ease-in-out lg:min-w-[280px] ${isUserMenuOpen ? "translate-y-0 shadow" : "-translate-y-full"}`}
          >
            <div className="flex h-max flex-col justify-between px-4 pt-16 pb-4 md:pt-18">
              {/* Navigation Links */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Avatar
                    className="border-default-400 dark:border-default-400 hover:border-primary cursor-pointer rounded-full border-2 transition-colors"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{session?.user?.name}</p>
                    <p className="text-xs capitalize">
                      {session?.user?.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-danger-400 cursor-pointer"
                >
                  <RiLogoutCircleRLine
                    size={20}
                    className="hover:text-danger-500"
                  />
                </button>
              </div>
              <div className="space-y-2">
                <Link
                  href="/"
                  color={pathname === "/" ? "primary" : "foreground"}
                  className="hover:text-primary flex items-center gap-2 font-medium"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <RiHome4Line /> Home
                </Link>
                {session?.user?.isAdmin && (
                  <Link
                    href="/admin"
                    color={pathname === "/admin" ? "primary" : "foreground"}
                    className="hover:text-primary flex items-center gap-2 font-medium"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <RiShieldUserLine /> Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  color={pathname === "/dashboard" ? "primary" : "foreground"}
                  className="hover:text-primary flex items-center gap-2 font-medium transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <RiAccountCircleLine /> Dashboard
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
