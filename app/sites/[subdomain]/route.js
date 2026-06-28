import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";

const MOCK_DB_PATH = path.join(process.cwd(), "lib", "mock-db.json");
const IS_MOCKED = 
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyBDFCqpZlwr9mOXtJvMs5pVJnN6D5E9kwA";

export async function GET(request, { params }) {
  // 1. Await params in newer Next.js versions
  const { subdomain } = await params;

  try {
    let data = null;

    if (IS_MOCKED) {
      // Load from local file in Demo Mode
      try {
        const fileContent = await fs.readFile(MOCK_DB_PATH, "utf-8");
        const list = JSON.parse(fileContent);
        data = list.find((site) => site.subdomain === subdomain);
      } catch (err) {
        console.warn("Could not load from mock database:", err.message);
      }
    } else {
      // Load from Firestore in Production Mode
      try {
        const docRef = doc(db, "websites", subdomain);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data = docSnap.data();
        }
      } catch (err) {
        console.warn("Firestore query failed, trying mock fallback:", err.message);
        // Secondary fallback to mock data if firestore is blocked or fails
        try {
          const fileContent = await fs.readFile(MOCK_DB_PATH, "utf-8");
          const list = JSON.parse(fileContent);
          data = list.find((site) => site.subdomain === subdomain);
        } catch (_) {}
      }
    }

    // 2. If website not found
    if (!data) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Website Not Found</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9; color: #333; }
            h1 { font-size: 32px; margin-bottom: 10px; color: #ff4757; }
            p { font-size: 18px; color: #666; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404 - Website Not Found</h1>
            <p>The shop website you are trying to visit is not registered yet.</p>
            <p style="font-size: 14px; margin-top: 30px;"><a href="/" style="color: #2f3542; text-decoration: none; font-weight: bold;">Start Your Own Website</a></p>
          </div>
        </body>
        </html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // 3. Check if the site is inactive (suspended/non-payment)
    if (data.status === "inactive") {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Website Inactive</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9; color: #333; }
            h1 { font-size: 32px; margin-bottom: 10px; color: #ffa502; }
            p { font-size: 18px; color: #666; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Website Inactive</h1>
            <p>This website is temporarily suspended or unpaid.</p>
            <p>If you are the shop owner, please contact the administrator to renew your services.</p>
          </div>
        </body>
        </html>`,
        {
          status: 403,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // 4. Read stored code components
    let html = data.html || "<h1>Welcome to our shop!</h1>";
    const css = data.css || "";
    const js = data.js || "";

    // Inject CSS dynamically if present (we try to inject before </head> or prepend)
    if (css) {
      if (html.includes("</head>")) {
        html = html.replace("</head>", `<style>${css}</style></head>`);
      } else {
        html = `<style>${css}</style>` + html;
      }
    }

    // Inject JS dynamically if present (we inject before </body> or append)
    if (js) {
      if (html.includes("</body>")) {
        html = html.replace("</body>", `<script>${js}</script></body>`);
      } else {
        html = html + `<script>${js}</script>`;
      }
    }

    // Return the completed client website
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error fetching/serving tenant site:", error);
    return new Response(
      `<h1>500 - Internal Server Error</h1><p>Failed to load the website.</p>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
