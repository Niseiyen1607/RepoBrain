"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q/A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meeting",
    url: "/meeting",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  { name: "projet1" },
  { name: "projet2" },
  { name: "projet3" },
  { name: "projet4" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="p-4 text-lg font-bold">
        <div className="flex items-center gap-2">
          {/* <Image src='/logo.png' alt='logo' width={40} height={40} /> */}
          {open && (
            <h1 className="text-primary/80 text-xl font-bold">RepoBrain</h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-semibold",
                        "hover:data-[active=true]:bg-primary/90 hover:data-[active=true]:text-primary-foreground",
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-sm border text-xs font-semibold",
                            "bg-primary text-primary-foreground",
                          )}
                        >
                          {project.name[0]?.toUpperCase()}
                        </div>
                        <span>{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {open && (
                <SidebarMenuItem className="mt-2">
                  <SidebarMenuButton asChild>
                    <Link href="/create">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <Plus className="size-4" />
                        <span>Create Project</span>
                      </Button>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
