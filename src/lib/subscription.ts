import { customInitApp } from "./firebase-admin-config";
import { client } from "./lemons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from 'firebase-admin';
import { NextResponse } from 'next/server';
import { getFirestore } from "firebase-admin/firestore";
import { cookies } from "next/headers";


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
customInitApp();
export async function getUserSubscriptionPlan() {
    try {
        const session = cookies().get("session")?.value || "";

        if (!session) {
            console.log("No session cookie found");
        }

        try {
            const decodedClaims = await auth().verifySessionCookie(session, true);

            console.log("Decoded claims:", decodedClaims);
            if (decodedClaims) {
                const db = getFirestore();

                // const cityRef = db.collection(`Classrooms/${classid}/Assignment`);

                const userQuery = db.collection("Users").where("uid", "==", decodedClaims.uid);


                const querySnapshot = await userQuery.get();

                if (querySnapshot.empty) {
                    console.log("Document does not exist.");
                    return { message: "Your account was not found", status: 404 };
                }

                const userDoc: User = querySnapshot.docs[0].data() as User;

                if (!userDoc) throw new Error("User not found");

                console.log("User Document:", userDoc); // Log userDoc to inspect its contents

                // Default values for isPro if variantId or currentPeriodEnd are missing or invalid
                let isPro = false;

                if (userDoc.variantId && userDoc.currentPeriodEnd) {
                    // Check if currentPeriodEnd is a valid date
                    const currentPeriodEnd = new Date(userDoc.currentPeriodEnd).getTime();
                    if (!isNaN(currentPeriodEnd)) {
                        // Calculate isPro based on variantId and currentPeriodEnd
                        isPro = currentPeriodEnd + 86_400_000 > Date.now();
                    }
                }

                console.log("isPro:", isPro); // Log isPro to inspect its value

                let subscription, isCanceled = false, updatePaymentMethodURL = null;

                if (isPro && userDoc.subscriptionId) {
                    subscription = await client.retrieveSubscription({ id: userDoc.subscriptionId });
                    isCanceled = subscription.data.attributes.cancelled;
                    updatePaymentMethodURL = subscription.data.attributes.urls.update_payment_method;
                }

                return {
                    ...userDoc,
                    currentPeriodEnd: new Date(userDoc.currentPeriodEnd).getTime(),
                    isCanceled,
                    isPro,
                    updatePaymentMethodURL: updatePaymentMethodURL,
                };


            } else {
                return NextResponse.json({ isLogged: false }, { status: 401 });
            }
        } catch (error) {
            console.error("Error verifying session cookie:", error);
            return NextResponse.json({ isLogged: false }, { status: 401 });
        }
    } catch (error) {
        console.error("Error fetching user subscription plan:", error);
        return { message: "An error occurred while fetching the subscription plan", status: 500 };
    }


}

