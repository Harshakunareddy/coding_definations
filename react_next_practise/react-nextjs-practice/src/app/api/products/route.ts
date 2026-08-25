// ==========================================
// API ROUTE (Route Handler)
// Shows: Next.js API routes, GET/POST handling, NextResponse
// ==========================================

import { NextRequest, NextResponse } from "next/server";

// In-memory store (for demo purposes)
const products = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "Phone", price: 699, category: "electronics" },
  { id: 3, name: "Shirt", price: 29, category: "clothing" },
];

// GET /api/products
export async function GET() {
  return NextResponse.json(products);
}

// POST /api/products
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Basic validation
  if (!body.name || !body.price) {
    return NextResponse.json(
      { error: "Name and price are required" },
      { status: 400 }
    );
  }

  const newProduct = {
    id: products.length + 1,
    name: body.name,
    price: body.price,
    category: body.category || "uncategorized",
  };

  products.push(newProduct);

  return NextResponse.json(newProduct, { status: 201 });
}
