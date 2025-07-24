interface MenuItem {
  path: string;
  label: string;
  subItems?: MenuItem[];
  isSuperAdmin?: boolean;
}

export default MenuItem;
