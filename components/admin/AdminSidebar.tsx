"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  Zap,
  User,
  FolderKanban,
  Briefcase,
  Mail,
  ImageIcon,
  Settings,
  Search,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",  href: "/admin",            icon: <LayoutDashboard size={15} /> },
  { label: "SEO",        href: "/admin/seo",         icon: <Search size={15} /> },
  { label: "Hero",       href: "/admin/hero",        icon: <Zap size={15} /> },
  { label: "About",      href: "/admin/about",       icon: <User size={15} /> },
  { label: "Projects",   href: "/admin/projects",    icon: <FolderKanban size={15} /> },
  { label: "Experience", href: "/admin/experience",  icon: <Briefcase size={15} /> },
  { label: "Contact",    href: "/admin/contact",     icon: <Mail size={15} /> },
  { label: "Media",      href: "/admin/media",       icon: <ImageIcon size={15} /> },
  { label: "Settings",   href: "/admin/settings",    icon: <Settings size={15} /> },
];

type Props = {
  userEmail: string;
  collapsed: boolean;
  onToggle: () => void;
};

export default function AdminSidebar({ userEmail, collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-bg-darker border-r border-border flex flex-col z-50 transition-[width] duration-200 overflow-hidden ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Brand + toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border shrink-0">
        {!collapsed && (
          <div>
            <span className="text-cream font-black text-xl uppercase tracking-tight">
              RG.
            </span>
            <p className="text-[10px] uppercase tracking-widest text-muted-dark mt-0.5">
              Admin
            </p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`text-muted hover:text-cream transition-colors duration-150 ${
            collapsed ? "mx-auto" : ""
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`
              flex items-center gap-3 px-2.5 py-2.5 text-[12px] uppercase tracking-wider
              transition-colors duration-150
              ${isActive(item.href)
                ? "bg-bg-surface text-cream border-l-2 border-violet"
                : "text-muted hover:text-cream-dim hover:bg-bg-surface"
              }
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-border">
        {!collapsed && (
          <p className="text-[10px] text-muted-dark truncate mb-3 px-2" title={userEmail}>
            {userEmail}
          </p>
        )}
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted hover:text-cream transition-colors duration-150 w-full px-2.5 py-2.5 hover:bg-bg-surface ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={13} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}