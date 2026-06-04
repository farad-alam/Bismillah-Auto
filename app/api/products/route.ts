import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface UploadedProduct {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

const productsFile = path.join(process.cwd(), 'data', 'products.json');

function readProducts(): UploadedProduct[] {
  try {
    if (!fs.existsSync(productsFile)) return [];
    return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
  } catch {
    return [];
  }
}

function writeProducts(products: UploadedProduct[]) {
  fs.mkdirSync(path.dirname(productsFile), { recursive: true });
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

export async function GET() {
  return NextResponse.json(readProducts());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.imageUrl) {
    return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
  }
  const products = readProducts();
  const newProduct: UploadedProduct = {
    id: Date.now().toString(),
    name: body.name?.trim() || '',
    imageUrl: body.imageUrl,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const products = readProducts().filter((p) => p.id !== id);
  writeProducts(products);
  return NextResponse.json({ success: true });
}
