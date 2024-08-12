import { NextResponse } from "next/server";
import axios from "axios";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { db } from "@/lib/firebase";
import { collection, where, getDocs, query } from "firebase/firestore";
import { getFirestore } from "firebase-admin/firestore";
interface User {
  createdAt: number | string;
  displayName: string;
  email: string;
  photoURL: string;
  subscriptionStatus: string;
  uid: string;
  subscriptionId: string;
  customerId: string;
  variantId: string;
  currentPeriodEnd: any;
}

export async function POST(request: Request) {
  try {


    const db = getFirestore();

    const { userId } = await request.json();


    const user = db.collection("Users").where("uid", "==", userId);


    const querySnapshot = await user.get();

    if (querySnapshot.empty) {
      console.log("Document does not exist.");
      return NextResponse.json({ message: "Your account was not found" }, { status: 404 })
    }

    const userDoc: User = querySnapshot.docs[0].data() as User;

    // @ts-ignore
    const { isPro } = await getUserSubscriptionPlan(userDoc);

    if (!isPro) return NextResponse.json({ message: "You are not subscribed" }, { status: 402 });

    await axios.patch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${userDoc.subscriptionId}`,
      {
        data: {
          type: "subscriptions",
          id: userDoc.subscriptionId,
          attributes: {
            cancelled: true, // <- ALl the line of code just for this
          },
        },
      },
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        },
      }
    );

    const endsAt = userDoc.currentPeriodEnd?.toLocaleString();

    return NextResponse.json({
      message: `Your subscription has been cancelled. You will still have access to our product until '${endsAt}'`,
    });
  } catch (err) {
    console.log({ err });
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
}