import Stripe from 'stripe';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

import {
    upsertPriceRecord,
    upsertProductRecord,
    managedSubscriptionStatusChange
} from "@/lib/supabaseAdmin";

const relevantsEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

// POST Requests
export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get('Stripe-Signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) return;

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log('Error message : ' + err.message);
        return new NextResponse(`Webhook Error : ${err.message}`, { status: 400 });
    }

    if (relevantsEvents.has(event.type)) {
        try {
            switch (event.type) {

                case 'product.created':
                case 'product.updated':
                    await upsertProductRecord(event.data.object as Stripe.Product);
                    break;

                case 'price.created':
                case 'price.updated':
                    await upsertPriceRecord(event.data.object as Stripe.Price);
                    break;

                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    await managedSubscriptionStatusChange(subscription.id, subscription.customer as string, event.type === 'customer.subscription.created');
                    break;

                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription;
                        await managedSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string, true);
                    }
                    break;
                default:
                    throw new Error('Unhandled relevant event!');
            }
        } catch (err) {
            console.log(err);
            return new NextResponse('Webhook error', { status: 400 });
        }
    }
    return NextResponse.json({ received: true }, { status: 200 });
}