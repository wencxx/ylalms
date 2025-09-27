import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "../auth/auth-provider";

// This is sample data.
const data = {
  user: {
    name: "Wency Baterna",
    email: "wncbtrn@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  main: [
    {
      name: "Dashboard",
      url: "/",
      emoji: "📈",
    },
    {
      name: "Students",
      url: "/students",
      emoji: "🧒",
    },
    {
      name: "Grades",
      url: "/grades",
      emoji: "📝",
    },
    {
      name: "Activities",
      url: "/activities",
      emoji: "✍️",
    },
    {
      name: "Todo",
      url: "/todo",
      emoji: "✍️",
    },
  ],
  students: [
    {
      name: "Profile",
      url: "/Profile",
      emoji: "👦",
    },
    {
      name: "Activities",
      url: "/activities",
      emoji: "✍️",
    },
    {
      name: "Todo",
      url: "/todo",
      emoji: "✍️",
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { currentUser } = useAuth();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {currentUser.role === "student" ? (
          <NavMain items={data.students} />
        ) : (
          <NavMain items={data.main} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
