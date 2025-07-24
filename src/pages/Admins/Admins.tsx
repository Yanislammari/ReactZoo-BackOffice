import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AdminCard from "../../components/AdminCard/AdminCard";
import "./Admins.css";
import UserService from "../../services/UserService";
import ZooService from "../../services/ZooService";
import User from "../../models/entities/User";
import Zoo from "../../models/entities/Zoo";
import { toast } from "sonner";

const UsersZoo: React.FC = () => {
  const { zooId } = useParams<{ zooId: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [zoo, setZoo] = useState<Zoo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchZooData = async () => {
      if (!zooId) {
        toast.error("ID du zoo manquant dans l'URL.");
        setLoading(false);
        return;
      }

      try {
        const session = localStorage.getItem("Session");
        if (!session) {
          toast.error("Aucune session trouvée. Veuillez vous reconnecter.");
          return;
        }

        const userService = new UserService();
        const zooService = new ZooService();

        console.log("Récupération des données du zoo:", zooId);
        
        const [allZoos, usersList] = await Promise.all([
          zooService.getZoos(session),
          userService.GetUsersOfZoo(session, zooId!)
        ]);

        const zooData = allZoos.find(zoo => zoo._id === zooId);
        
        if (!zooData) {
          toast.error("Zoo non trouvé.");
          return;
        }

        console.log("Zoo récupéré:", zooData);
        console.log("Utilisateurs récupérés:", usersList);
        
        setZoo(zooData);
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors du chargement des données du zoo.");
      } finally {
        setLoading(false);
      }
    };

    fetchZooData();
  }, [zooId]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="UsersZoo">
        <Navbar />
        <div className="UsersZooPage">
          <div className="loading">Chargement des utilisateurs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="UsersZoo">
      <Navbar />
      <div className="UsersZooPage">
        <div className="users-header">
          <h1>Utilisateurs - {zoo?.name || "Zoo"}</h1>
          <p>Liste de tous les utilisateurs assignés à ce zoo</p>
        </div>
        
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search">
                ✕
              </button>
            )}
          </div>
          <div className="search-results">
            {searchTerm && (
              <p>{filteredUsers.length} résultat(s) trouvé(s) pour "{searchTerm}"</p>
            )}
          </div>
        </div>
        
        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <p>
                {searchTerm 
                  ? "Aucun utilisateur ne correspond à votre recherche." 
                  : "Aucun utilisateur assigné à ce zoo."
                }
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <AdminCard key={user._id} admin={user} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersZoo;
