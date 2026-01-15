import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const itemSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  image: z.string().optional(),
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

    // Kategori ve restoran kontrolü
    const category = await db.category.findFirst({
      where: { id },
      include: { restaurant: true },
    });

    if (!category || category.restaurant.userId !== session.user.id) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    const data = itemSchema.parse(body);

    // Son sırayı bul
    const lastItem = await db.menuItem.findFirst({
      where: { categoryId: id },
      orderBy: { order: "desc" },
    });

    const item = await db.menuItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        image: data.image || null,
        order: lastItem ? lastItem.order + 1 : 0,
        categoryId: id,
      },
    });

    return NextResponse.json(item);
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
