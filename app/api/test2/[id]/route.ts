import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string} }
) {
    const id = Number( params.id );
    const items = await prisma.test2.findUnique({where : { id },});
    return items
        ? NextResponse.json(items)
        : NextResponse.json({ message: "Item not found" }, { status: 404 });
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string} }
) {
    const id = Number( params.id );
    const { name } = await request.json();
    const updated = await prisma.test2.update({
        where: { id },
        data: { name },
    });
    return NextResponse.json(updated);
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string} }
) {
    const id = Number( params.id );
    await prisma.test2.delete({ where: { id } });
    return NextResponse.json({ message: "Item deleted" });
}
