import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getURL } from "@/lib/helpers";
import { createOrRetrieveACustomer } from "@/lib/supabaseAdmin";

export async function POST() {
    try {
        const supabase = createRouteHandlerClient({
            cookies
        });

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("Couldn't get user!");
        }

        const customer = await createOrRetrieveACustomer({
            uuid: user.id || '',
            email: user.email || ''
        });

        if (!customer) {
            throw new Error("Couldn't get customer!");
        }

        const { url } = await stripe.billingPortal.sessions.create({
            customer,
            return_url: `${getURL()}/account`
        });

        return NextResponse.json({ url });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err);
        return new NextResponse('Internal Error', { status: 500 });
    }
}