import { Buffer } from "buffer";
import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import rawBody from "raw-body";
import { Readable } from "stream";
import { client } from "@/lib/lemons";
import { getFirestore } from "firebase-admin/firestore";
import { auth } from "firebase-admin";

export async function POST(request: Request) {
    try {
        const db = getFirestore();

        const body = await rawBody(Readable.from(Buffer.from(await request.text())));
        const headersList = headers();
        const payload = JSON.parse(body.toString());
        const sigString = headersList.get("x-signature");
        const secret = process.env.LEMONS_SQUEEZY_SIGNATURE_SECRET as string;
        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(body as any).digest("hex"), "utf8");
        const signature = Buffer.from(Array.isArray(sigString) ? sigString.join("") : sigString || "", "utf8");

        // Check if the webhook event was for this product or not
        if (parseInt(payload.data.attributes.product_id) !== parseInt(process.env.LEMONS_SQUEEZY_PRODUCT_ID as string)) {
            return NextResponse.json({ message: "Invalid product" }, { status: 403 });
        }

        // Validate signature
        if (!crypto.timingSafeEqual(digest as any, signature as any)) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
        }

        const userId = payload.meta.custom_data[0];

        // Check if custom defined data (userId) is provided
        if (!userId) {
            return NextResponse.json({ message: "No userId provided" }, { status: 403 });
        }

        switch (payload.meta.event_name) {
            case "subscription_created": {
                const subscription = await client.retrieveSubscription({ id: payload.data.id });



                const userQuery = db.collection("Users").where("uid", "==", userId);
                const querySnapshot = await userQuery.get();

                const updateData = {
                    subscriptionId: `${subscription.data.id}`,
                    customerId: `${payload.data.attributes.customer_id}`,
                    variantId: subscription.data.attributes.variant_id,
                    currentPeriodEnd: subscription.data.attributes.renews_at,
                };

                const userDocRef = querySnapshot.docs[0].ref;

                await userDocRef.update(updateData);

                console.log("Document successfully updated!");

                return NextResponse.json({ message: "Webhook received" }, { status: 200 });
            }

            case "subscription_updated": {
                const subscription = await client.retrieveSubscription({ id: payload.data.id });


                const userQuery = db.collection("Users").where("subscriptionId", "==", subscription.data.id);


                const querySnapshot = await userQuery.get();

                if (querySnapshot.empty) {
                    return NextResponse.json({ message: "User not found" }, { status: 404 });
                }


                const userDocRef = querySnapshot.docs[0].ref;

                await userDocRef.update({
                    variantId: subscription.data.attributes.variant_id,
                    currentPeriodEnd: subscription.data.attributes.renews_at,
                });


                console.log("Document successfully updated!");

                return NextResponse.json({ message: "Webhook received" }, { status: 200 });
            }

            default: {
                return NextResponse.json({ message: "Unknown event" }, { status: 500 });
            }
        }


    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
