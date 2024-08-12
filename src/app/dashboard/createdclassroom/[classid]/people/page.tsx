"use client";

import CryptoJS from "crypto-js";
import { CopyIcon, Link, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type Classroom = {
  id: string;
  Classname: string;
  TeacherName: string;
  TeacherEmail: string;
  TeacherUid: string;
  Section: string;
  Subject: string;
  Createdby: string;
  students: string[];
  studentsData: Student[];
};

type Student = {
  uid: string;
  name: string;
  email: string;
};

const Page = () => {
  const params = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const classid = Array.isArray(params.classid)
    ? params.classid.join("")
    : params.classid;
  const randomImage = ["02.png", "01.png", "03.png", "04.png", "05.png"][
    Math.floor(Math.random() * 5)
  ];

  useEffect(() => {
    if (classid) {
      renderStudents();
    }
  }, [classid]);

  const renderStudents = () => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const q = query(
            collection(db, "Classrooms"),
            where("Createdby", "==", authUser.uid),
            orderBy("Createddata")
          );

          const querySnapshot = await getDocs(q);

          const classroomsData: Classroom[] = [];
          querySnapshot.forEach((doc) => {
            classroomsData.push({
              id: doc.id,
              ...doc.data(),
            } as Classroom);
          });

          const foundObject = classroomsData.find(
            (item) => item.id === classid
          );
          if (foundObject) {
            setStudents(foundObject?.studentsData || []);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        console.log("No user is currently authenticated");
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  };

  async function deleteStudent(uid: string): Promise<void> {
    try {
      if (classid && uid && user) {
        const classroomDocRef = doc(db, "Classrooms", classid);
        const classroomDoc = await getDoc(classroomDocRef);

        if (classroomDoc.exists()) {
          const classroomData = classroomDoc.data();

          const students = classroomData.students || [];
          const studentsData = classroomData.studentsData || [];

          const studentIndex = students.findIndex(
            (studentUid: string) => studentUid === uid
          );
          const studentDataIndex = studentsData.findIndex(
            (student: Student) => student.uid === uid
          );

          if (studentIndex !== -1) {
            students.splice(studentIndex, 1);
          }

          if (studentDataIndex !== -1) {
            studentsData.splice(studentDataIndex, 1);
          }

          await updateDoc(classroomDocRef, { students, studentsData });

          renderStudents();
        } else {
          console.error(`Classroom document with ID ${classid} not found.`);
        }
      } else {
        console.error("Missing classid or uid");
      }
    } catch (error) {
      console.error("Error removing student:", error);
      throw new Error("Failed to remove student");
    }
  }

  return (
    <Card className={`col-span-3 ${styles.paddcard}`}>
      <CardHeader>
        <CardTitle>Students Details</CardTitle>
        <CardDescription>Manage class students</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-[100%] h-[5rem] rounded-sm" />
        ) : students.length === 0 ? (
          <div className={`${styles.emptyMessage} p-5 w-full text-center`}>
            No students have joined
          </div>
        ) : (
          <div className="space-y-8">
            {students.map((item) => (
              <div className="flex items-center" key={item.uid}>
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarImage src={`/${randomImage}`} alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.name}
                  </p>
                  <p
                    className={`text-sm text-muted-foreground ${styles.email}`}
                  >
                    {item.email}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Email Student</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          deleteStudent(item.uid);
                        }}
                      >
                        Remove Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
