"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db, app } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Icons } from "@/components/ui/Icons";
import Link from "next/link";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "../styles.module.css";

type Assignment = {
  id: string;
  assignmentname: string;
  submissionDate: number;
  Scoredmarks: number;
  Questiontype: string;
  totalmarks: number;
  isSubmitted: boolean;
  submittedassignmentid: string;
};

export default function InpuMaterialtFile() {
  const params = useParams();
  const classid = params.classid;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        if (classid && authUser) {
          try {
            const assignmentsRef = collection(
              db,
              `Classrooms/${classid}/Assignment`
            );
            const assignmentsSnapshot = await getDocs(assignmentsRef);

            const mergedResults: Assignment[] = await Promise.all(
              assignmentsSnapshot.docs.map(async (assignmentDoc) => {
                const assignmentId = assignmentDoc.id;
                const assignmentname = assignmentDoc.data().assignmentname;
                const Questiontype = assignmentDoc.data().Questiontype;
                const totalmarks = assignmentDoc.data().totalmarks;

                const submittedAssignmentsRef = collection(
                  db,
                  `Classrooms/${classid}/submitted_assignment`
                );

                const submittedAssignmentsQuery = query(
                  submittedAssignmentsRef,
                  where("studentUUID", "==", `${authUser.uid}`),
                  where("assignmentId", "==", assignmentId)
                );

                const submittedAssignmentsSnapshot = await getDocs(
                  submittedAssignmentsQuery
                );

                const submittedassignmentid =
                  submittedAssignmentsSnapshot.docs[0]?.id;
                const isSubmitted = !submittedAssignmentsSnapshot.empty;

                let submissionDate = null;
                let Scoredmarks = null;

                if (isSubmitted) {
                  const submittedAssignmentData =
                    submittedAssignmentsSnapshot.docs[0].data();
                  submissionDate = submittedAssignmentData.submissionDate;
                  Scoredmarks = submittedAssignmentData.scoredMarks;
                }

                return {
                  id: assignmentId,
                  assignmentname: assignmentname,
                  Questiontype,
                  totalmarks,
                  isSubmitted,
                  submissionDate,
                  Scoredmarks,
                  submittedassignmentid,
                };
              })
            );

            setAssignments(mergedResults);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [classid, auth]);

  const path = usePathname();

  return (
    <div className={`flex flex-col gap-3 overflow-hidden ${styles.tbc}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment name</TableHead>
            <TableHead>Assignment Type</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Marks Scored</TableHead>
            <TableHead>Detailed Marks</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment: Assignment, index: any) => (
            <TableRow key={index}>
              <TableCell>{assignment.assignmentname}</TableCell>
              <TableCell>{assignment.Questiontype}</TableCell>
              <TableCell>
                {assignment.submissionDate
                  ? new Date(assignment.submissionDate).toLocaleDateString(
                      "en-US"
                    )
                  : "-"}
              </TableCell>

              <TableCell>
                {assignment.isSubmitted
                  ? `${assignment.Scoredmarks || 0}/${assignment.totalmarks}`
                  : "Not submitted"}
              </TableCell>

              <TableCell>
                {assignment.isSubmitted ? (
                  <Link
                    href={`${path}/report/?type=${assignment.Questiontype}&assignmentid=${assignment.submittedassignmentid}`}
                  >
                    Get detailed marks
                  </Link>
                ) : (
                  "Submit to view results"
                )}
              </TableCell>

              <TableCell>
                {assignment.isSubmitted ? (
                  <span className="line-through">submitted</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <Icons.circlecheck />
                    <Link
                      href={`${path}/${assignment.id}/?type=${assignment.Questiontype}`}
                    >
                      Submit now
                    </Link>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
