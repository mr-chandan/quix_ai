import { cache } from 'react'
export const revalidate = 3600
import { toast } from "@/components/ui/use-toast";
import { cookies } from 'next/headers';
import { auth } from 'firebase-admin';
import { NextResponse } from 'next/server';
import { customInitApp } from '../firebase-admin-config';
import { getFirestore } from "firebase-admin/firestore";


type Question = {
    question: string;
    options: string[];
    answer: string;
}[];

customInitApp()


type Assignment = {
    id: string;
    assignmentname: string;
    topic: string;
    noquestions: number;
    difficulty: string;
    Questiontype: string;
    questionDatatoadd: { questions: Question };
    totalmarks: number;
};


export const getAssignmentsData = cache(async (classid: string) => {
    const assignmentData: Assignment[] = [];
    try {
        const session = cookies().get("session")?.value || "";

        if (!session) {
            console.log("No session cookie found");
            return assignmentData;
        }

        try {
            const decodedClaims = await auth().verifySessionCookie(session, true);
            if (decodedClaims) {
                const db = getFirestore();
                ///////verification left
                const cityRef = db.collection(`Classrooms/${classid}/Assignment`);
                const querySnapshot = await cityRef.get();

                querySnapshot.forEach((doc) => {
                    const assignmentDataItem: Assignment = {
                        id: doc.id,
                        assignmentname: doc.data().assignmentname,
                        topic: doc.data().topic,
                        noquestions: doc.data().noquestions,
                        difficulty: doc.data().difficulty,
                        Questiontype: doc.data().Questiontype,
                        questionDatatoadd: doc.data().questionDatatoadd,
                        totalmarks: doc.data().totalmarks,
                    };

                    assignmentData.push(assignmentDataItem);
                });
            } else {
                console.log("isLogged: false");
                return assignmentData;
            }
        } catch (error) {
            console.error("Error verifying session cookie:", error);
            console.log("isLogged: false");
            return assignmentData;
        }
    } catch (error) {
        console.error("Error getting documents:", error);
    }
    return assignmentData;
})