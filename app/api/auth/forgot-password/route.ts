import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest){
    try {
        const body = await req.json();
        const {email} = body;
        const baseUrl =
        process.env.NODE_ENV === "production"
        ? "https://the-hunt-dusky.vercel.app"
        : "http://localhost:3000";

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const {error} = await supabase.auth.resetPasswordForEmail(email,{
            redirectTo: `${baseUrl}/change-password`
        });

        if (error) {
            return NextResponse.json({error: error.message}, {status: 400});
        }

        return NextResponse.json({success:true, message: "Password reset link sent to email"});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "An unexpected error occurred"},
            {status: 500}
        );
    }
}