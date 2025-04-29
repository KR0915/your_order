import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("❗️ [ENV] DATABASE_URL =", process.env.DATABASE_URL);
    console.log("❗️ [ENV] DATABASE_PRISMA_URL =", process.env.DATABASE_PRISMA_URL);
    const name = await prisma.test1.findMany();
    return NextResponse.json(name);
}

export async function POST(request: Request) {
    const { name } = await request.json();
    if (typeof name !=="string") {
        return NextResponse.error();
    }
    const created = await prisma.test1.create({
        data: { name },
    });
    return NextResponse.json(created, { status: 201 });
}