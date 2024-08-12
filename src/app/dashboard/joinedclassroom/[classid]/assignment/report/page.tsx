"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Shortquestions from "./Shortquestions";
import Mcq from "./Mcq";
import TF from "./TF";
import Blanks from "./Blanks";

type Question = {
  question: string;
  options: string[];
  answer: string;
}[];

type AssignmentData = {
  topic: string;
  noquestions: number | null;
  difficulty: string;
  Questiontype: string | null;
  questionDatatoadd: { questions: Question };
  totalmarks: number;
};

type materialtype = {
  topic: string;
  instructions: string;
  totalmarks: number;
  Questiontype: "WrittenAssignment";
};

const Page = ({
  params,
}: {
  params: { answerassignment: string; classid: string };
}) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const assignmentid = searchParams.get("assignmentid");
  const [assignment, setassignment] = useState<AssignmentData | null>();
  const [materialassignment, setmaterialassignment] =
    useState<materialtype | null>();

  useEffect(() => {
    if (
      type === "Mcq" ||
      type === "TF" ||
      type === "Fillinblanks" ||
      type === "Shortanswers"
    ) {
      fetchAssignmentMcq(params.classid, assignmentid as string);
    } else if (type === "WrittenAssignment") {
      fetchwrittenassignment(params.classid, assignmentid as string);
    } else {
      alert("There was a error with the assignments (Type not supported)");
    }
  }, [params.classid, params.answerassignment, type]);

  async function fetchwrittenassignment(classId: string, assignmentId: string) {
    try {
      const assignmentRef = doc(
        db,
        `Classrooms/${classId}/submitted_assignment/${assignmentId}`
      );

      const assignmentSnapshot = await getDoc(assignmentRef);

      const assignment: materialtype | null = assignmentSnapshot.exists()
        ? (assignmentSnapshot.data() as materialtype)
        : null;
      setmaterialassignment(assignment);
      console.log("Assignment:", assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  }

  async function fetchAssignmentMcq(classId: string, assignmentId: string) {
    try {
      const assignmentRef = doc(
        db,
        `Classrooms/${classId}/submitted_assignment/${assignmentId}`
      );

      const assignmentSnapshot = await getDoc(assignmentRef);

      const assignment: AssignmentData | null = assignmentSnapshot.exists()
        ? (assignmentSnapshot.data() as AssignmentData)
        : null;
      setassignment(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  }

  switch (type) {
    case "Mcq":
      return <Mcq document={(assignment as any) || null} />;
    case "TF":
      return <TF document={(assignment as any) || null} />;
    case "Fillinblanks":
      return <Blanks document={(assignment as any) || null} />;
    case "WrittenAssignment":
      return (
        // <Material
        //   topic={materialassignment?.topic || ""}
        //   instructions={materialassignment?.instructions || ""}
        //   totalmarks={materialassignment?.totalmarks || 0}
        // />
        <div className="p-5">Nothing to view yet</div>
      );
    case "Shortanswers":
      return <Shortquestions document={(assignment as any) || null} />;
    default:
      return <div>Type not supported</div>;
  }
};

export default Page;
