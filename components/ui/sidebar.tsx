"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  IconHome,
  IconUser,
  IconBriefcase,
  IconSchool,
  IconBrandHipchat,
  IconLogin,
  IconMenu2,
  IconX,
  IconUserCircle,
  IconBook,
  IconChevronDown,
  IconChevronUp,
  IconZoomCode,
  IconLayout,
  IconBrandOpenai,
  IconLink,
  IconUsers,
  IconSettings,
  IconMessage,
  IconFolders,
  IconDots,
  IconCodeDots,
  IconRocket,
  IconFlame,
  IconUserPlus
} from "@tabler/icons-react";
import { useAuth } from "../auth/auth-provider";

interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Check if user is admin
  const isAdmin = user?.email === "admin@sgcombinator.com";
  
  const links: Links[] = [
    {
      label: "Home",
      href: "/",
      icon: <IconHome size={22} stroke={1.5} />
    },
    {
      label: "AI Consultant",
      href: "/ai-consultant",
      icon: <IconBrandHipchat size={22} stroke={1.5} />,
      requiresAuth: true
    },
    {
      label: "Founder Matching",
      href: "/founder-matching",
      icon: <IconUser size={22} stroke={1.5} />,
      requiresAuth: true
    },
    {
      label: "Job Listings",
      href: "/jobs",
      icon: <IconBriefcase size={22} stroke={1.5} />,
      requiresAuth: true
    }
  ];
  
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      <SidebarBody>
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="p-4 flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white-100">
                <Image src="/logo.svg" alt="SG Combinator Logo" width={18} height={18} />
              </div>
              <motion.span
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                  marginLeft: open ? "0.75rem" : "0"
                }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-xl text-black overflow-hidden whitespace-nowrap"
              >
                SG Combinator
              </motion.span>
            </div>
            <div className="mt-6 px-2">
              {links.map((link) => (
                <SidebarLink 
                  key={link.href} 
                  link={link} 
                  active={pathname === link.href} 
                />
              ))}
              
              {/* Academy section with sublinks */}
              <div className="mb-2">
                <Link
                  href="/academy"
                  className={cn(
                    "flex items-center group/sidebar py-2 px-2 rounded-lg hover:bg-gray-100 transition-colors",
                    pathname === "/academy" 
                      ? "bg-gray-50 font-medium" 
                      : pathname.startsWith("/academy") 
                      ? "bg-gray-50/50" 
                      : ""
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-md",
                    pathname.startsWith("/academy") ? "bg-emerald-100 text-emerald-600" : "text-gray-600"
                  )}>
                    <IconSchool size={22} stroke={1.5} />
                  </div>
                  <motion.span
                    animate={{
                      opacity: open ? 1 : 0,
                      width: open ? "auto" : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "text-gray-700 text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-nowrap overflow-hidden ml-2",
                      pathname.startsWith("/academy") && "font-semibold text-black"
                    )}
                  >
                    Academy
                  </motion.span>
                </Link>
                
                {/* Sublinks - only shown when Academy is active */}
                {open && pathname.startsWith("/academy") && (
                  <div className="ml-11 mt-1 space-y-1 border-l pl-2 border-gray-200">
                    <Link
                      href="/academy/courses"
                      className={cn(
                        "block py-1.5 px-2 text-sm rounded-md transition-colors",
                        pathname === "/academy/courses" || pathname.startsWith("/academy/courses/")
                          ? "text-emerald-700 font-medium bg-emerald-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      Courses
                    </Link>
                    <Link
                      href="/academy/forum"
                      className={cn(
                        "block py-1.5 px-2 text-sm rounded-md transition-colors",
                        pathname === "/academy/forum" || pathname.startsWith("/academy/forum/")
                          ? "text-emerald-700 font-medium bg-emerald-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      Forum
                    </Link>
                    <Link
                      href="/academy/chatbot"
                      className={cn(
                        "block py-1.5 px-2 text-sm rounded-md transition-colors",
                        pathname === "/academy/chatbot"
                          ? "text-emerald-700 font-medium bg-emerald-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      AI Assistant
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Admin Section: Onboarding */}
              {isAdmin && (
                <SidebarLink 
                  link={{
                    label: "Onboarding",
                    href: "/onboarding",
                    icon: <IconUserPlus size={22} stroke={1.5} />
                  }} 
                  active={pathname === "/onboarding" || pathname.startsWith("/onboarding")} 
                />
              )}
            </div>
          </div>
          <div className="p-4 border-t border-black/5">
            {user ? (
              <SidebarLink
                link={{
                  label: "Profile",
                  href: "/profile",
                  icon: <IconUserCircle size={22} stroke={1.5} />
                }}
                active={pathname === "/profile"}
              />
            ) : (
              <SidebarLink
                link={{
                  label: "Sign In",
                  href: "/auth/signin",
                  icon: <IconLogin size={22} stroke={1.5} />
                }}
                active={pathname === "/auth/signin"}
              />
            )}
          </div>
        </div>
      </SidebarBody>
    </SidebarProvider>
  );
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-screen sticky top-0 hidden md:flex md:flex-col bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border-r border-black/5 w-[280px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "70px") : "280px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md w-full sticky top-0 z-10 border-b border-black/5"
        )}
        {...props}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
            <Image src="/logo.svg" alt="SG Combinator Logo" width={18} height={18} />
          </div>
          <h1 className="font-semibold text-xl ml-3 text-black">
            SG Combinator
          </h1>
        </div>
        <div className="flex justify-end z-20 w-auto">
          <IconMenu2
            className="text-black cursor-pointer w-6 h-6"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white/95 backdrop-blur-md p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-black cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <IconX size={24} />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

interface SidebarLinkProps {
  link: Links;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarLink = ({
  link,
  className,
  active,
  onClick,
}: SidebarLinkProps) => {
  const { open, animate } = useSidebar();
  const { user } = useAuth();
  const needsAuth = link.requiresAuth && !user;
  
  const linkContent = (
    <>
      <div className={cn(
        "w-9 h-9 flex items-center justify-center rounded-md",
        active ? "bg-emerald-100 text-emerald-600" : "text-gray-600"
      )}>
        {link.icon}
      </div>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "text-gray-700 text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-nowrap overflow-hidden ml-2",
          active && "font-semibold text-black"
        )}
      >
        {link.label}
      </motion.span>
    </>
  );
  
  const linkClassName = cn(
    "flex items-center group/sidebar py-2 px-2 rounded-lg hover:bg-gray-100 transition-colors mb-2",
    active && "bg-gray-50 font-medium",
    className
  );
  
  if (onClick) {
    return (
      <button onClick={onClick} className={linkClassName}>
        {linkContent}
      </button>
    );
  }
  
  return (
    <Link
      href={needsAuth ? "/auth/signin?redirect=" + link.href : link.href}
      className={linkClassName}
    >
      {linkContent}
    </Link>
  );
}; 