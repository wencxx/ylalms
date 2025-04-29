import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavLink
            to={item.url}
            key={item.name}
            className={({ isActive }) =>
              isActive ? 'bg-custom-primary rounded-md' : ''
            }
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.name}>
                {item.icon && <item.icon />}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </NavLink>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
