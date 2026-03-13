"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DeleteModal from "@/components/DeleteModal";
import Toast from "@/components/Toast";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const fetchContacts = useCallback(async () => {
    try {
      const url = search
        ? `/api/contacts?search=${encodeURIComponent(search)}`
        : "/api/contacts";
      const res = await fetch(url);
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/contacts/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast({ message: "Contact deleted successfully", type: "success" });
        fetchContacts();
      } else {
        setToast({ message: "Failed to delete contact", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to delete contact", type: "error" });
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage all your contacts in one place</p>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link href="/contacts/create" className="btn btn-primary">
            Add Contact
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading...
          </div>
        ) : contacts.length === 0 ? (
          <div className="table-wrapper">
            <div className="empty-state">
              <h3 className="empty-state-title">
                {search ? "No results found" : "No contacts yet"}
              </h3>
              <p className="empty-state-text">
                {search
                  ? "Try a different search term"
                  : "Get started by adding your first contact"}
              </p>
              {!search && (
                <Link href="/contacts/create" className="btn btn-primary">
                  Add Contact
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="table-name">{contact.name}</td>
                    <td className="table-email">{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.company || "-"}</td>
                    <td>{contact.position || "-"}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/contacts/${contact.id}/edit`}
                          className="btn btn-ghost btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(contact)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteTarget && (
          <DeleteModal
            contactName={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </>
  );
}
