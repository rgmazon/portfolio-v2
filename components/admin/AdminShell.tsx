"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

type Props = {
  userEmail: string;
  children: React.ReactNode;
};

export default function AdminShell({ userEmail, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar
        userEmail={userEmail}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <main
        className={`min-h-screen transition-[margin] duration-200 ${
          collapsed ? "ml-14" : "ml-56"
        }`}
      >
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
