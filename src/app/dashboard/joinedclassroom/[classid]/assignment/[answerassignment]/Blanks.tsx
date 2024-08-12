import React, { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
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

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = answer;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const Sendassignment = useDebounce(async () => {
    console.log(selectedAnswers);
    if (
      user &&
      classid &&
      assignmentid &&
      type === "Fillinblanks" &&
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
          Questiontype: "Fillinblanks",
        };
        try {
          const docRef = await addDoc(
            collection(db, `Classrooms/${classid}/submitted_assignment`),
            Datatobeadded
          );

          axios.post("/api/queue", {
            classroomId: classid,
            documentId: docRef.id,
            type: "Fillinblanks",
          });

          const CACHE_KEY = `${user.uid.slice(
            0,
            5
          )}joinedclassroom${classid}assignmnets`;
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(`${CACHE_KEY}_timestamp`);
          router.back();
        } catch {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }

        setLoading(false);
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
      if (
        selectedAnswers[index].trim().toLowerCase() ===
        question.answer.trim().toLowerCase()
      ) {
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
              Type your answer and submit the form
            </p>
          </div>
          {selectedAnswers.length === questions.length &&
            questions.map((question, index) => (
              <div key={index}>
                <div className="space-y-2 mb-5">
                  <label htmlFor="question1" className="text-lg font-medium">
                    {question.question}
                  </label>
                  <Textarea
                    id={`question${index + 1}`}
                    placeholder="Type your answer here..."
                    className="p-4 rounded-md border border-input bg-background text-foreground"
                    rows={3}
                    value={selectedAnswers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                </div>
              </div>
            ))}

          <Button onClick={Sendassignment} disabled={loading}>
            Submit Answers
          </Button>
        </div>
      )}
    </>
  );
};

export default Qid;
