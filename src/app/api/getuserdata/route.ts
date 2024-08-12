import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getFirestore } from "firebase-admin/firestore";
customInitApp();

export async function POST(request: NextRequest) {
    const data = await request.json();
    const { classid } = data;

    const session = cookies().get("session")?.value || "";

    if (!session) {
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    try {
        const decodedClaims = await auth().verifySessionCookie(session, true);
        //@ts-ignore
        const { isPro } = await getUserSubscriptionPlan(decodedClaims);

        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        const db = getFirestore();

        let isCreated = false;

        if (classid === "forms") {
            const docQuery = db.collection(`Userassignments`)
                .where("createduser", "==", decodedClaims.uid)
                .where("dateofcreation", ">=", startOfDay.toISOString())
                .where("dateofcreation", "<", endOfDay.toISOString());

            const querySnapshot = await docQuery.get();

            isCreated = querySnapshot.size >= 5;

        } else {
            const docQuery = db.collection(`Classrooms/${classid}/Assignment`)
                .where("dateofcreation", ">=", startOfDay.toISOString())
                .where("dateofcreation", "<", endOfDay.toISOString());

            const querySnapshot = await docQuery.get();

            isCreated = querySnapshot.size >= 10;
        }

        return NextResponse.json({ isPro, isCreated }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }
}
