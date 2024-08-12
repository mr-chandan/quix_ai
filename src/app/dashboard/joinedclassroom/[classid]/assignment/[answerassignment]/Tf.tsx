import React, { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import axios from "axios";
import useDebounce from "@/components/useDebounce";

interface Question {
  question: string;
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
      type === "TF" &&
      user.uid &&
      user.email &&
      user.displayName
    ) {
      try {
        setLoading(true);
        const score = calculateScore();

        const assignmentData = questions.map((question, index) => ({
          question: question.question,
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
          Questiontype: "TF",
        };

        const docRef = await addDoc(
          collection(db, `Classrooms/${classid}/submitted_assignment`),
          Datatobeadded
        );

        axios.post("/api/queue", {
          classroomId: classid,
          documentId: docRef.id,
          type: "TF",
        });

        const CACHE_KEY = `${user.uid.slice(
          0,
          5
        )}joinedclassroom${classid}assignmnets`;
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(`${CACHE_KEY}_timestamp`);
        setLoading(false);
        router.back();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });

        setLoading(false);
      }
    } else {
      console.log("No user is currently authenticated or classid is missing");

      setLoading(false);
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
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`q${index}`}
                      value="TRUE"
                      checked={selectedAnswers[index] === "TRUE"}
                      onChange={() => handleOptionChange(index, "TRUE")}
                      className=" mr-2"
                    />
                    <span className="">True</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      name={`q${index}`}
                      value="FALSE"
                      checked={selectedAnswers[index] === "FALSE"}
                      onChange={() => handleOptionChange(index, "FALSE")}
                      className=" mr-2"
                    />
                    <span className="">False</span>
                  </label>
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
