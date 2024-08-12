// @ts-ignore
import type { CreateCheckoutResult } from "lemonsqueezy.ts/dist/types";
import { NextResponse } from "next/server";
import axios from "axios";
import { client } from "@/lib/lemons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { auth } from "firebase-admin";
import { cookies } from "next/headers";
import { getFirestore } from "firebase-admin/firestore";

export type CreateCheckoutResponse = {
    data: any;
    checkoutURL: string;
};

export async function POST(request: Request) {
    try {

        const session = cookies().get("session")?.value || "";

        if (!session) {
            console.log("No session cookie found");
        }

        try {
            const decodedClaims = await auth().verifySessionCookie(session, true);
            if (decodedClaims) {
                const db = getFirestore();

                const user = db.collection("Users").where("uid", "==", decodedClaims.uid);


                const querySnapshot = await user.get();

                if (querySnapshot.empty) {
                    console.log("Document does not exist.");
                    return NextResponse.json({ message: "Your account was not found" }, { status: 404 })
                }
                const userDoc: User = querySnapshot.docs[0].data() as User;

                const variant = (
                    await client.listAllVariants({ productId: process.env.LEMONS_SQUEEZY_PRODUCT_ID })
                ).data[0];


                const checkout = await axios.post(
                    "https://api.lemonsqueezy.com/v1/checkouts",
                    {
                        data: {
                            type: "checkouts",
                            attributes: {
                                checkout_data: { email: userDoc.email, custom: [userDoc.uid] },
                                product_options: {
                                    redirect_url: "https://quixai.vercel.app"
                                },
                            },
                            relationships: {
                                store: { data: { type: "stores", id: process.env.LEMON_SQUEEZY_STORE_ID } },
                                variant: { data: { type: "variants", id: variant.id } },
                            },
                        },
                    },
                    {
                        headers:
                        {
                            Accept: "application/vnd.api+json",
                            "Content-Type": "application/vnd.api+json",
                            Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
                        }

                    }
                ) as CreateCheckoutResult;

                const checkoutUrl = checkout.data.data.attributes.url;

                return NextResponse.json({ checkoutURL: checkoutUrl }, { status: 201 });

            }
        } catch (error) {
            console.error("Error verifying session cookie:", error);
            return NextResponse.json({ isLogged: false }, { status: 401 });
        }





    } catch (err: any) {
        console.log(err);
        return NextResponse.json({ message: err.message || err }, { status: 500 });
    }
}