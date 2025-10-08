import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserTable from "../../../ui/UserTable";
import UserFormModal from "../../../ui/UserFormModal";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";

export default function Users() {
  const { setMessage } = useMessage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("users/"); //backend endpoint
      setUsers(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage({ type: "error", text: "Failed to fetch users." });
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingUser) {
        await api.put(`users/${editingUser.id}/`, data);
        setMessage({ type: "success", text: "User updated successfully!" });
      } else {
        await api.post("users/", data);
        setMessage({ type: "success", text: "User created successfully!" });
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save user." });
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    try {
      await api.delete(`users/${u.id}/`);
      setMessage({ type: "success", text: "User deleted successfully!" });
      fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Failed to delete user." });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">User Management</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage all users in the system.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-accent transition"
        >
          + Add User
        </button>
      </div>

      <UserTable
        users={users}
        loading={loading}
        onEdit={(u) => {
          setEditingUser(u);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      <UserFormModal
        show={showModal}
        editingUser={editingUser}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />
    </motion.div>
  );
}
