import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "transfer-reviews.json");

async function getReviews() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveReviews(reviews: unknown[]) {
  await writeFile(DATA_FILE, JSON.stringify(reviews, null, 2));
}

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const review = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    verified: false,
    ...body,
  };

  const reviews = await getReviews();
  reviews.push(review);
  await saveReviews(reviews);

  return NextResponse.json(review, { status: 201 });
}
