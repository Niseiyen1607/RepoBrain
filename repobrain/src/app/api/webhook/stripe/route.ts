import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalide signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const credits = Number(session.metadata?.credits);
    const userId = session.client_reference_id;

    if (!userId || !Number.isInteger(credits) || credits <= 0) {
      return NextResponse.json(
        { error: "Missing userId or credits" },
        { status: 400 },
      );
    }

    await db.$transaction([
      db.stripeTransaction.create({ data: { userId, credits } }),
      db.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      }),
    ]);
    return NextResponse.json(
      { message: "Credits added successfully" },
      { status: 200 },
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
