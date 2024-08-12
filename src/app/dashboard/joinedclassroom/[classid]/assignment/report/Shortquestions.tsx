"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Question {
  question: string;
  answer: string;
  selectedAnswer: string;
  score: number;
  feedback: string;
}

type SubmittedAssignment = {
  studentUUID: string;
  studentEmail: string;
  studentName: string;
  assignmentId: string;
  scoredMarks: number;
  selectedanswer: Question[];
  totalmarks: number;
  submissionDate: number;
  Questiontype: string;
  overallFeedback_for_teacher: string;
  overallFeedback_for_student: string;
};

interface QidProps {
  document: SubmittedAssignment | null;
}

const Shortquestions: React.FC<QidProps> = ({ document }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document) {
      setLoading(false);
    }
    if (
      document &&
      (!document.overallFeedback_for_student ||
        document.overallFeedback_for_student.trim() === "")
    ) {
      toast({
        title: "No Feedback Yet",
        description:
          "Our AI system will grade your assignment soon. Please check back in a few minutes.",
      });
    }
  }, [document]);

  if (loading) {
    return (
      <div className="p-4 grid gap-4">
        <Skeleton className="w-full h-48 md:h-56 lg:h-64 xl:h-72 rounded-sm" />
        <Skeleton className="w-full h-48 md:h-56 lg:h-64 xl:h-72 rounded-sm" />
        <Skeleton className="w-full h-48 md:h-56 lg:h-64 xl:h-72 rounded-sm" />
        <Skeleton className="w-full h-48 md:h-56 lg:h-64 xl:h-72 rounded-sm" />
        <Skeleton className="w-full h-48 md:h-56 lg:h-64 xl:h-72 rounded-sm" />
        <Skeleton className="w-full h-48 md:h-56 lg:h-64 xl:h-72 rounded-sm" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-3">
      <Card className="mb-6 rounded-lg border border-gray-200">
        <CardHeader className="pb-0">
          <h2 className="text-2xl font-bold mb-2">Assignment Report</h2>
          <p className="text-2sm">Student: {document?.studentName}</p>
          <p className="text-2sm">
            Submission Date:{" "}
            {document &&
              format(new Date(document.submissionDate), "MMMM dd, yyyy")}
          </p>
          <p className="text-2sm">
            Score: {document?.scoredMarks} / {document?.totalmarks}
          </p>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <div className="text-xl font-semibold mb-4">Detailed Feedback</div>
          {document?.selectedanswer.map((qa, index) => (
            <div key={index} className="mb-6">
              <p className="font-semibold text-lg mb-1">{qa.question}</p>
              <p
                className={`text-base mb-1 ${
                  qa.answer === qa.selectedAnswer
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                Your Answer: {qa.selectedAnswer}
              </p>
              <p className="text-base mb-1 text-gray-600">
                Correct Answer: {qa.answer}
              </p>
              <p className="text-base mb-2 text-gray-600">
                Score: {qa.score || "Not assigned"}
              </p>
              <div className="mt-2">
                <ReactMarkdown className="markdown-content">
                  {qa.feedback || "Not assigned"}
                </ReactMarkdown>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
          <h3 className="text-xl font-semibold mb-4">
            Overall Feedback for Student
          </h3>
          <div className="mb-4">
            {document && (
              <ReactMarkdown className="markdown-content">
                {document.overallFeedback_for_student || "Not assigned"}
              </ReactMarkdown>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shortquestions;
