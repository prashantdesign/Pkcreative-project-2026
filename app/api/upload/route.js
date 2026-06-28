import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/gdrive";
import { Readable } from "stream";

// Helper to convert a Web File Buffer into a Node.js Readable Stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const subdomain = formData.get("subdomain"); // e.g. 'greenshop'

    if (!file || !subdomain) {
      return NextResponse.json(
        { error: "Missing file or subdomain parameter." },
        { status: 400 }
      );
    }

    const drive = getDriveClient();
    if (!drive) {
      return NextResponse.json(
        { error: "Google Drive integration is not configured. Add credentials to .env.local" },
        { status: 503 }
      );
    }

    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
    let clientFolderId = null;

    // Step 1: Find or Create client-specific folder
    if (parentFolderId) {
      try {
        const folderQuery = `name = '${subdomain}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed = false`;
        const existingFolders = await drive.files.list({
          q: folderQuery,
          fields: "files(id)",
        });

        if (existingFolders.data.files && existingFolders.data.files.length > 0) {
          clientFolderId = existingFolders.data.files[0].id;
        } else {
          // Folder doesn't exist, create it
          const folderMetadata = {
            name: subdomain,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentFolderId],
          };
          const createdFolder = await drive.files.create({
            requestBody: folderMetadata,
            fields: "id",
          });
          clientFolderId = createdFolder.data.id;
        }
      } catch (err) {
        console.warn("Could not query/create subfolder (using parent folder instead):", err.message);
      }
    }

    // Step 2: Convert file to buffer and stream it to Drive
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const media = {
      mimeType: file.type,
      body: bufferToStream(buffer),
    };

    const fileMetadata = {
      name: `${Date.now()}-${file.name.replace(/\s+/g, "_")}`,
      parents: clientFolderId ? [clientFolderId] : (parentFolderId ? [parentFolderId] : []),
    };

    const uploadedFile = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = uploadedFile.data.id;

    // Step 3: Set file permission to "public reader" so it is accessible as an image link
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } catch (err) {
      console.warn("Failed to set public permissions on file:", err.message);
    }

    // Step 4: Construct direct web rendering URL
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return NextResponse.json({
      success: true,
      fileId,
      url: directUrl,
    });
  } catch (error) {
    console.error("Google Drive Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to Google Drive." },
      { status: 500 }
    );
  }
}
