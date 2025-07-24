import React from "react";
import User from "../../models/entities/User";
import "./AdminCard.css";
import { FaEdit, FaTrash } from "react-icons/fa";

interface AdminCardProps {
  admin: User;
}

const AdminCard: React.FC<AdminCardProps> = ({ admin }) => {

  const handleEdit = () => {
    console.log('Modifier admin:', admin);
  };

  const handleDelete = () => {
    console.log('Supprimer admin:', admin);
  };

  return (
    <div className="AdminCard">
      <div className="admin-info">
        <div className="admin-avatar">
          {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
        </div>
        <div className="admin-details">
          <h3>{admin.firstName} {admin.lastName}</h3>
          <p className="admin-email">{admin.email}</p>
          <p className="admin-login">@{admin.login}</p>
        </div>
      </div>
      <div className="admin-actions">
        <button className="btn-edit" onClick={handleEdit}><FaEdit size={14} /></button>
        <button className="btn-delete" onClick={handleDelete}><FaTrash size={14} /></button>
      </div>
    </div>
  );
};

export default AdminCard;
