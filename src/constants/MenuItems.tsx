import MenuItem from "../models/structs/MenuItem";

const menuItems: MenuItem[] = [
  { 
    path: "/", 
    label: "Tableau de bord"
  },
  { 
    path: "/zoos", 
    label: "Zoo\'s",
    subItems: [
      { 
        path: "/zoos/gestion",
        label: "Gestion"
      },
      {
        path: "/zoos/affectations",
        label: "Affectations"
      }
    ],
    isSuperAdmin: true
  },
  { 
    path: "/admins", 
    label: "Admins",
    subItems : [
      {
        path: "/admins/manage",
        label: "Manage admins"
      },
      {
        path: "/admins/add",
        label: "Add admin"
      },
    ],
    isSuperAdmin: true
  },
  { 
    path: "/espaces", 
    label: "Espaces",
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
