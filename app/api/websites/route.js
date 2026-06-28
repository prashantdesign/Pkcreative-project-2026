import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import os from "os";

const MOCK_DB_PATH = process.env.VERCEL
  ? path.join(os.tmpdir(), "mock-db.json")
  : path.join(process.cwd(), "lib", "mock-db.json");

// Helper to ensure the directory and file exist
async function ensureDbExists() {
  try {
    await fs.mkdir(path.dirname(MOCK_DB_PATH), { recursive: true });
    await fs.access(MOCK_DB_PATH);
  } catch (err) {
    // If folder or file doesn't exist, create it with empty array
    await fs.writeFile(MOCK_DB_PATH, JSON.stringify([]));
  }
}

export async function GET() {
  try {
    await ensureDbExists();
    const fileContent = await fs.readFile(MOCK_DB_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Mock DB Read Error:", error);
    return NextResponse.json({ error: "Failed to read database." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureDbExists();
    const fileContent = await fs.readFile(MOCK_DB_PATH, "utf-8");
    const list = JSON.parse(fileContent);

    const body = await request.json();
    const { subdomain } = body;

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
    }

    const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    // Check if updating or creating
    const index = list.findIndex((site) => site.subdomain === cleanSubdomain);
    const updatedPayload = { ...body, subdomain: cleanSubdomain, updatedAt: Date.now() };

    if (index >= 0) {
      list[index] = updatedPayload;
    } else {
      list.push(updatedPayload);
    }

    await fs.writeFile(MOCK_DB_PATH, JSON.stringify(list, null, 2));
    return NextResponse.json({ success: true, site: updatedPayload });
  } catch (error) {
    console.error("Mock DB Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await ensureDbExists();
    const fileContent = await fs.readFile(MOCK_DB_PATH, "utf-8");
    const list = JSON.parse(fileContent);

    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
    }

    const cleanSubdomain = subdomain.trim().toLowerCase();
    const newList = list.filter((site) => site.subdomain !== cleanSubdomain);

    await fs.writeFile(MOCK_DB_PATH, JSON.stringify(newList, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mock DB Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
