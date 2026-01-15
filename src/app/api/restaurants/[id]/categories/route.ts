import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  description: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;

    // Restoran kontrolü
    const restaurant = await db.restaurant.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    const data = categorySchema.parse(body);

    // Son sırayı bul
    const lastCategory = await db.category.findFirst({
      where: { restaurantId: id },
      orderBy: { order: "desc" },
    });

    const category = await db.category.create({
      data: {
        name: data.name,
        description: data.description || null,
        order: lastCategory ? lastCategory.order + 1 : 0,
        restaurantId: id,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
