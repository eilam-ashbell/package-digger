import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url')
    const { data } = await axios.get(url)
    return NextResponse.json({ ...data });
}
