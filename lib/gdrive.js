import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    console.error("Google Drive client email or private key is missing in environment variables.");
    return null;
  }

  // Handle keys wrapped in quotes and escaped newlines
  const formattedPrivateKey = privateKey
    .replace(/^["']|["']$/g, "") // remove quotes if present
    .replace(/\\n/g, "\n");

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    formattedPrivateKey,
    SCOPES
  );

  return google.drive({ version: "v3", auth });
}

export { getDriveClient };
