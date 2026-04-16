import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "transfer-profiles.json");

async function getProfiles() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveProfiles(profiles: unknown[]) {
  await writeFile(DATA_FILE, JSON.stringify(profiles, null, 2));
}

export async function GET() {
  const profiles = await getProfiles();
  return NextResponse.json(profiles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const profile = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...body,
  };

  const profiles = await getProfiles();
  profiles.push(profile);
  await saveProfiles(profiles);

  return NextResponse.json(profile, { status: 201 });
}
