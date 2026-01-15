import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const restaurantSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  primaryColor: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const data = restaurantSchema.parse(body);

    // Unique slug oluştur
    let slug = slugify(data.name);
    const existingRestaurant = await db.restaurant.findUnique({
      where: { slug },
    });
    if (existingRestaurant) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const restaurant = await db.restaurant.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        address: data.address || null,
        phone: data.phone || null,
        primaryColor: data.primaryColor || "#f97316",
        userId: session.user.id,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const restaurants = await db.restaurant.findMany({
      where: { userId: session.user.id },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
