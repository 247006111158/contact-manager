"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          Contact<span>Hub</span>
        </Link>
        <div className="navbar-links">
          <Link
            href="/"
            className={`navbar-link ${pathname === "/" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/contacts"
            className={`navbar-link ${pathname.startsWith("/contacts") ? "active" : ""}`}
          >
            Contacts
          </Link>
          <Link href="/contacts/create" className="btn btn-primary btn-sm">
            Add Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
