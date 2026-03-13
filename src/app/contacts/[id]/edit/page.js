"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";

export default function EditContactPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const res = await fetch(`/api/contacts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          position: data.position || "",
        });
      } else {
        setToast({ message: "Contact not found", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to load contact", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/contacts/${id}`);
      } else {
        const data = await res.json();
        setToast({
          message: data.error || "Failed to update contact",
          type: "error",
        });
      }
    } catch {
      setToast({ message: "Failed to update contact", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading contact data...
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
          <Link href={`/contacts/${id}`} className="back-link">
            &larr; Back to Contact
          </Link>
          <h1 className="page-title">Edit Contact</h1>
          <p className="page-subtitle">Update contact information</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+62 812 3456 7890"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="company">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="form-input"
                placeholder="Acme Inc."
                value={form.company}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="position">
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                className="form-input"
                placeholder="Software Engineer"
                value={form.position}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <Link href={`/contacts/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>

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
