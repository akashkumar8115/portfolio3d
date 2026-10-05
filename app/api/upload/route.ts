import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getSessionFromCookieHeader } from "@/server/auth";
import {
  maxUploadBytes,
  uploadExtensionByType,
  uploadMetadataSchema,
} from "@/lib/validation/upload";

export async function POST(req: Request) {
  const session = await getSessionFromCookieHeader(req.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxUploadBytes + 1024 * 1024) {
    return NextResponse.json({ error: "Files must be 20 MB or smaller." }, { status: 413 });
  }

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    return NextResponse.json({ error: "Upload must use multipart form data." }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json({ error: "The upload form is invalid or incomplete." }, { status: 400 });
    }
    throw error;
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const parsed = uploadMetadataSchema.safeParse({ type: file.type, size: file.size });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Unsupported file." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = uploadExtensionByType[parsed.data.type];
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
