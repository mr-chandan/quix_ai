"use client";

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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
