import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const {newPassword} = body;

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const {error} = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return NextResponse.json({error: error.message}, {status: 400});
        };

        return NextResponse.json({
            success: true,
            message: "Successfully changed password"
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "An unexpected error occurred"},
            {status: 500}
        );
    }
}