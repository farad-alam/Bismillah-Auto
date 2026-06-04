import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.IMAGEBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ImageBB API key not configured' }, { status: 500 });
  }

  const incoming = await request.formData();
  const image = incoming.get('image') as File | null;
  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const imgbbForm = new FormData();
  imgbbForm.append('image', image);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: imgbbForm,
  });

  const data = await res.json();
  if (!data.success) {
    return NextResponse.json({ error: 'ImageBB upload failed', detail: data }, { status: 502 });
  }

  return NextResponse.json({ url: data.data.url });
}
