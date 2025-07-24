import MenuItem from "../models/structs/MenuItem";

const menuItems: MenuItem[] = [
  { 
    path: "/", 
    label: "Tableau de bord"
  },
  { 
    path: "/zoos", 
    label: "Zoo\'s",
    isSuperAdmin: true
  },
  { 
    path: "/admins", 
    label: "Admins",
    isSuperAdmin: true
  },
  { 
    path: "/spaces", 
    label: "Spaces",
  },
  { 
    path: "/animaux", 
    label: "Animaux",
  },
  { 
    path: "/employes", 
    label: "Employés",
  },
  { 
    path: "/billets", 
    label: "Billets",
  }
];

export default menuItems;
