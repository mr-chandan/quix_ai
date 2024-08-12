"use client";

import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";
import useDebounce from "@/components/useDebounce";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

type SubmittedAssignment = {
  studentUUID: string;
  studentEmail: string;
  studentName: string;
  assignmentId: string;
  scoredMarks: number;
  selectedanswer: any;
  totalmarks: number;
  submissionDate: number;
  Questiontype: string;
};

interface QidProps {
  questions: Question[];
  totalmarks: number;
  topic: string;
}

const Qid: React.FC<QidProps> = ({ questions, totalmarks, topic }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  const params = useParams();
  const classid = params.classid;
  const assignmentid = params.answerassignment;
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    setSelectedAnswers(Array(questions.length).fill(""));
  }, [questions]);

  const handleOptionChange = (
    questionIndex: number,
    selectedOption: string
  ) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const Sendassignment = useDebounce(async () => {
    if (
      user &&
      classid &&
      assignmentid &&
      type === "Mcq" &&
      user.uid &&
      user.email &&
      user.displayName
    ) {
      try {
        setLoading(true);
        const score = calculateScore();
        const assignmentData = questions.map((question, index) => ({
          question: question.question,
          options: question.options,
          answer: question.answer,
          selectedAnswer: selectedAnswers[index],
        }));

        const Datatobeadded: SubmittedAssignment = {
          studentUUID: user.uid,
          studentEmail: user.email,
          studentName: user.displayName,
          assignmentId: assignmentid as string,
          scoredMarks: score,
          selectedanswer: assignmentData,
          totalmarks,
          submissionDate: Date.now(),
          Questiontype: "Mcq",
        };

        console.log(Datatobeadded);
        try {
          const docRef = await addDoc(
            collection(db, `Classrooms/${classid}/submitted_assignment`),
            Datatobeadded
          );

          axios.post("/api/queue", {
            classroomId: classid,
            documentId: docRef.id,
            type: "Mcq",
          });

          const CACHE_KEY = `${user.uid.slice(
            0,
            5
          )}joinedclassroom${classid}assignmnets`;
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(`${CACHE_KEY}_timestamp`);
          router.back();

          setLoading(false);
        } catch {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });

          setLoading(false);
        }
      } catch (error) {
        alert("there was a error on mapping");
        console.log(error);
        setLoading(false);
      }
    } else {
      console.log("No user is currently authenticated or classid is missing");
    }
  }, 2000);

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        score++;
      }
    });
    return score;
  };

  return (
    <>
      {topic && questions && selectedAnswers && (
        <div className="p-4">
          <div className="mb-5">
            <h3 className="text-xl font-medium">Topic: {topic}</h3>
            <p className="text-sm text-muted-foreground">
              Mark your answer and submit the form
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {questions.map((question, index) => (
              <Card className="p-4" key={index}>
                <div className="text-lg font-normal mb-2">
                  {index + 1}. {question.question}
                </div>

                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2">
                      <input
                        type="radio"
                        id={`q${index}-option${optionIndex}`}
                        name={`q${index}`}
                        value={option}
                        checked={selectedAnswers[index] === option}
                        onChange={() => handleOptionChange(index, option)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`q${index}-option${optionIndex}`}
                        className="cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <Button onClick={Sendassignment} className="mt-5" disabled={loading}>
            Submit Answers
          </Button>
        </div>
      )}
    </>
  );
};

export default Qid;
