import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ZooCard from "../../components/ZooCard/ZooCard";
import CreateZooForm from "../../components/CreateZooForm/CreateZooForm";
import "./Zoos.css";
import ZooService from "../../services/ZooService";
import Zoo from "../../models/entities/Zoo";
import { toast } from "sonner";

const Zoos: React.FC = () => {
  const [Zoos, setZoos] = useState<Zoo[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const zooService = new ZooService();

  useEffect(() => {
    const fetchZoos = async () => {
      try {
        const session = localStorage.getItem("Session");
        const zoos = await zooService.getZoos(session!);
        setZoos(zoos);
      }
      catch (error) {
        toast.error("Failed to fetch zoos. Please try again later.");
      }
    };

    fetchZoos();
  }, []);

  const handleCreateZoo = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleZooCreated = async () => {
    try {
      const session = localStorage.getItem("Session");
      const zoos = await zooService.getZoos(session!);
      setZoos(zoos);
      setShowCreateForm(false);
    }
    catch (error) {
      toast.error("Erreur lors du rafraîchissement de la liste.");
    }
  };

  return (
    <div className="Zoos">
      <Navbar />
      <div className="ZoosPage">
        <div className="zoos-grid">
          {Zoos.map((zoo) => (
            <ZooCard key={zoo._id} zoo={zoo} />
          ))}
        </div>
        
        <button className="floating-add-btn" onClick={handleCreateZoo}>
          +
        </button>
        
        {showCreateForm && (
          <CreateZooForm 
            onClose={handleCloseForm} 
            onZooCreated={handleZooCreated}
          />
        )}
      </div>
    </div>
  );
}

export default Zoos;
