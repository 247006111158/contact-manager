"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import Navbar from "@/components/Navbar";
import DeleteModal from "@/components/DeleteModal";
import Toast from "@/components/Toast";

export default function ContactDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const res = await fetch(`/api/contacts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setContact(data);
      } else {
        setToast({ message: "Contact not found", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to load contact", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/contacts/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/contacts");
      } else {
        setToast({ message: "Failed to delete contact", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to delete contact", type: "error" });
    }
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading contact Details...
          </div>
        </main>
      </>
    );
  }

  if (!contact) {
    return (
      <>
        <Navbar />
        <main className="container">
          <div className="page-header">
            <Link href="/contacts" className="back-link">
              &larr; Back to Contacts
            </Link>
            <h1 className="page-title">Contact Not Found</h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <Link href="/contacts" className="back-link">
            &larr; Back to Contacts
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 className="page-title">{contact.name}</h1>
              <p className="page-subtitle">
                {contact.position && contact.company 
                  ? `${contact.position} at ${contact.company}`
                  : contact.company || contact.position || "Contact Details"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link href={`/contacts/${contact.id}/edit`} className="btn btn-secondary">
                Edit
              </Link>
              <button 
                className="btn btn-danger"
                onClick={() => setDeleteTarget(contact)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-row">
            <div className="detail-label">Full Name</div>
            <div className="detail-value" style={{ fontWeight: 600 }}>{contact.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Email Address</div>
            <div className="detail-value">
              <a href={`mailto:${contact.email}`} style={{ color: "var(--accent)" }}>
                {contact.email}
              </a>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Phone Number</div>
            <div className="detail-value">
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Company</div>
            <div className="detail-value">{contact.company || "-"}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Position</div>
            <div className="detail-value">{contact.position || "-"}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Created At</div>
            <div className="detail-value" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {new Date(contact.created_at).toLocaleString()}
            </div>
          </div>
        </div>

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
