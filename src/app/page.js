"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const companiesCount = new Set(
    contacts.filter((c) => c.company).map((c) => c.company)
  ).size;

  const recentContacts = contacts.slice(0, 5);

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your contact database</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Contacts</div>
            <div className="stat-value accent">
              {loading ? "-" : contacts.length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Companies</div>
            <div className="stat-value success">
              {loading ? "-" : companiesCount}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Recent (7 days)</div>
            <div className="stat-value warning">
              {loading
                ? "-"
                : contacts.filter((c) => {
                    const created = new Date(c.created_at);
                    const now = new Date();
                    const diff = now - created;
                    return diff < 7 * 24 * 60 * 60 * 1000;
                  }).length}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
            Recent Contacts
          </h2>
          <Link href="/contacts" className="btn btn-ghost btn-sm">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading...
          </div>
        ) : recentContacts.length === 0 ? (
          <div className="table-wrapper">
            <div className="empty-state">
              <h3 className="empty-state-title">No contacts yet</h3>
              <p className="empty-state-text">
                Get started by adding your first contact
              </p>
              <Link href="/contacts/create" className="btn btn-primary">
                Add Contact
              </Link>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="table-name">{contact.name}</td>
                    <td className="table-email">{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.company || "-"}</td>
                    <td>
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
