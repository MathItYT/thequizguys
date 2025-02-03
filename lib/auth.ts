import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession } from "./session";

export async function login(req: NextRequest, code: string) {
    const success = await createSession(code)
    if (success) {
        return NextResponse.redirect(new URL('/platform', req.url))
    }
    return NextResponse.redirect(new URL('/', req.url))
}

export async function logout(req: NextRequest) {
    await deleteSession()
    return NextResponse.redirect(new URL('/', req.url))
}