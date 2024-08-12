"use client";

import styles from "../styles.module.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import CryptoJS from "crypto-js";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { User, onAuthStateChanged } from "firebase/auth";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/components/useDebounce";

type Announcement = {
  id?: string;
  Message: string;
  createdAt: number | string;
};

const formSchema = z.object({
  message: z
    .string()
    .min(5, {
      message: "Minimun 10 letters should be there",
    })
    .max(10000, {
      message: "Max 10000 letters should be there",
    }),
});

const Announcement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const classid = params.classid;
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const fetchAnnouncements = useCallback(async () => {
    const CACHE_EXPIRATION = 10 * 60 * 1000;
    const currentTime = new Date().getTime();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const CACHE_KEY = `${authUser.uid.slice(
          0,
          5
        )}announcementsData${classid}`;
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

        if (
          cachedData &&
          cachedTimestamp &&
          currentTime - parseInt(cachedTimestamp) < CACHE_EXPIRATION
        ) {
          const decryptedBytes = CryptoJS.AES.decrypt(cachedData, CACHE_KEY);
          const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

          const parsedData = JSON.parse(decryptedData) as Announcement[];
          setAnnouncements(parsedData);
        } else {
          try {
            const q = query(
              collection(db, `Classrooms/${classid}/Announcements`),
              orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);

            const classroomsData: Announcement[] = [];
            querySnapshot.forEach((doc) => {
              classroomsData.push({
                id: doc.id,
                ...doc.data(),
              } as Announcement);
            });

            const dataToEncrypt = JSON.stringify(classroomsData);
            const encryptedData = CryptoJS.AES.encrypt(
              dataToEncrypt,
              CACHE_KEY
            ).toString();

            localStorage.setItem(CACHE_KEY, encryptedData);
            localStorage.setItem(
              `${CACHE_KEY}_timestamp`,
              currentTime.toString()
            );

            setAnnouncements(classroomsData);
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            });
          }
        }
      } else {
        toast({
          title: "No user authenticated",
          description: "Please login and try again",
        });
        console.log("No user is currently authenticated");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [classid]);

  useEffect(() => {
    if (classid) {
      fetchAnnouncements();
    }
  }, [classid, fetchAnnouncements]);

  const onSubmit = useDebounce(async (values: z.infer<typeof formSchema>) => {
    if (submiting) {
      return;
    }

    setSubmiting(true);

    if (user && classid) {
      const CACHE_KEY = `${user.uid.slice(0, 5)}announcementsData${classid}`;
      const Datatobeadded: Announcement = {
        Message: values.message,
        createdAt: Date.now(),
      };

      try {
        await addDoc(
          collection(db, `Classrooms/${classid}/Announcements`),
          Datatobeadded
        ).then(() => {
          toast({
            title: "Announcement sent!",
            description: "Announcement was Sucessfull sent",
          });
          form.setValue("message", "");
        });
      } catch (error) {
        console.error("Error sending announcement");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request",
        });
      } finally {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(`${CACHE_KEY}_timestamp`);
        fetchAnnouncements();
        setSubmiting(false);
      }
    } else {
      console.log("No user is currently authenticated or classid is missing");
      toast({
        title: "No user authenticated",
        description: "Pls login and try again",
      });
      setSubmiting(false);
    }

    setSubmiting(false);
  }, 300);

  return (
    <div className="p-2 flex gap-3 flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Send an Announcement</CardTitle>
          <CardDescription>Anyone in the class can view it.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`flex ${styles.inp}`}
                autoComplete="off"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter the message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="shrink-0" disabled={submiting}>
                  Send Announcement
                </Button>
              </form>
            </Form>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="w-[100%] h-[5rem] rounded-sm" />
                <Skeleton className="w-[100%] h-[5rem] rounded-sm" />
              </>
            ) : announcements.length === 0 ? (
              <div
                className={`${styles.emptyMessage} p-5 mt-10 w-full text-center`}
              >
                No announcements found. Be the first one to send.
              </div>
            ) : (
              announcements.map((announcement, index) => (
                <div
                  className="grid gap-6 bg-accent rounded-sm p-2"
                  key={index}
                >
                  <div className="cursor-pointer">
                    <div className="text-muted-foreground text-[15px]">
                      Announcement :
                    </div>
                    <div className="text-muted-foreground text-[13px]">
                      {new Date(announcement.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </div>
                    <div className="text-muted-foreground text-[15px] hover:text-foreground">
                      {announcement.Message.charAt(0).toUpperCase() +
                        announcement.Message.slice(1)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcement;
