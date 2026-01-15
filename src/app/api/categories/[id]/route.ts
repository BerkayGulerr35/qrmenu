import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export async function PATCH(
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
    const data = updateSchema.parse(body);

    const updated = await db.category.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;

    const category = await db.category.findFirst({
      where: { id },
      include: { restaurant: true },
    });

    if (!category || category.restaurant.userId !== session.user.id) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ message: "Kategori silindi" });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
