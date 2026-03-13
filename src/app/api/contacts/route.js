import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let query = "SELECT * FROM contacts";
    let params = [];

    if (search) {
      query +=
        " WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?";
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, position } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO contacts (name, email, phone, company, position) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, company || null, position || null]
    );

    const [newContact] = await pool.query(
      "SELECT * FROM contacts WHERE id = ?",
      [result.insertId]
    );

    return NextResponse.json(newContact[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
