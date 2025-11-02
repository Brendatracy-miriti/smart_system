import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserTable from "../../../ui/UserTable";
import UserFormModal from "../../../ui/UserFormModal";
import ConfirmDialog from "../../../ui/ConfirmDialog";
import { useMessage } from "../../../hooks/useMessage";
import { useData } from "../../../context/DataContext";
import { updateUser as updateLocalUser } from "../../../utils/localData";

export default function Users() {
  const { setMessage } = useMessage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  // persist showInactive preference
  useEffect(() => {
    try {
      const v = localStorage.getItem("admin_show_inactive");
      if (v !== null) setShowInactive(v === "true");
    } catch (e) {}
  }, []);
  const { data, addUser, updateUser, setData } = useData();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // load from DataContext/localStorage, show all users since seed data is removed
      let local = Array.isArray(data?.users) ? data.users : [];
      if (!showInactive) local = local.filter((u) => u.is_active !== false);
      setUsers(local);
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
        updateUser(editingUser.id, data);
        setMessage({ type: "success", text: "User updated successfully!" });
      } else {
        const u = { id: Date.now(), ...data };
        addUser(u);
        // If student, also add to students array
        if (u.role === "student") {
          const { addStudent } = await import("../../../utils/localData");
          addStudent({
            id: u.id,
            userId: u.id,
            name: u.name,
            email: u.email,
            admission_number: u.admission_number,
            course: u.course,
            attendance_rate: 80,
            average_score: 70,
            courses_count: 1,
            completed_assignments: 0,
            gpa: 0,
          });
        }

        // If teacher, add to teachers array
        if (u.role === "teacher") {
          const { addTeacher } = await import("../../../utils/localData");
          addTeacher({
            id: u.id,
            userId: u.id,
            name: u.name,
            email: u.email,
            courses: u.courses || [],
          });
        }

        // If parent, add to parents array
        if (u.role === "parent") {
          const { addParent } = await import("../../../utils/localData");
          addParent({
            id: u.id,
            userId: u.id,
            name: u.name,
            email: u.email,
            childStudentId: u.childStudentId || null,
          });
        }
        setMessage({ type: "success", text: "User created successfully!" });
      }
      setShowModal(false);
      setEditingUser(null);
      // refresh local list
      const local = Array.isArray(data?.users) ? data.users : [];
      setUsers(local);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save user." });
    }
  };

  const handleDelete = async (u) => {
    setUserToDelete(u);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      // remove locally
      setData((p) => ({ ...p, users: p.users.filter((x) => x.id !== userToDelete.id) }));
      setMessage({ type: "success", text: "User deleted successfully!" });
      const local = Array.isArray(data?.users) ? data.users.filter((x) => x.id !== userToDelete.id) : [];
      setUsers(local);
    } catch {
      setMessage({ type: "error", text: "Failed to delete user." });
    }
    setShowConfirmDialog(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setUserToDelete(null);
  };

  const toggleActive = (u) => {
    try {
      const newVal = !u.is_active;
      // update in DataContext
      updateUser(u.id, { is_active: newVal });
      // update localData for compatibility
      try { updateLocalUser(u.id, { is_active: newVal }); } catch (e) {}
      setMessage({ type: "success", text: `User ${newVal ? "activated" : "deactivated"}` });
      // refresh list
      fetchUsers();
    } catch (e) {
      setMessage({ type: "error", text: "Failed to update user status." });
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
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={showInactive} onChange={(e) => { setShowInactive(e.target.checked); try { localStorage.setItem("admin_show_inactive", String(e.target.checked)); } catch (err) {} fetchUsers(); }} />
            Show inactive
          </label>
          <button
          onClick={() => setShowModal(true)}
          className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-accent transition"
        >
          + Add User
        </button>
        </div>
      </div>

      <UserTable
        users={users}
        loading={loading}
        onEdit={(u) => {
          setEditingUser(u);
          setShowModal(true);
        }}
        onDelete={handleDelete}
        onToggleActive={toggleActive}
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

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </motion.div>
  );
}
