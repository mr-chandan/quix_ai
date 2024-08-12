"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import styles from "./styles.module.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useChat } from "ai/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import McqEditor from "./McqEditor";
import { useEffect, useState } from "react";
import TFEditor from "./TFeditor";
import FillinblanksEditor from "./FillinblanksEditor";
import { FunctionCallHandler } from "ai";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Shortanswerseditor from "./Shortanswerseditor";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

interface TF {
  question: string;
  answer: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Topic must be at least 2 characters.",
    })
    .max(40, {
      message: "Topic must be at most 40 characters.",
    }),
  text: z
    .string()
    .min(5, {
      message: "Topic must be at least 5 characters.",
    })
    .max(10000, {
      message: "Topic must be at most 10000 characters.",
    }),
  topic: z
    .string()
    .min(2, {
      message: "Topic must be at least 2 characters.",
    })
    .max(40, {
      message: "Topic must be at most 40 characters.",
    }),
  noquestions: z.coerce
    .number()
    .gte(1, {
      message: "Number of questions must be at least 1.",
    })
    .lte(10, {
      message: "Max Number of questions is 10.",
    }),
  difficulty: z.string(),
});

export default function ProfileForm() {
  const [formState, setFormState] = useState<
    "initial" | "loading" | "final" | "Error"
  >("initial");
  const searchParams = useSearchParams();
  const querydata = searchParams.get("type");
  const [topic, settopic] = useState<string>("");
  const [assignmentname, setassignmentname] = useState<string>("");
  const [noquestions, setnoquestions] = useState<number>(1);
  const [difficulty, setdifficulty] = useState<string>("");
  const [Mcqarray, setMcqarray] = useState<Question[]>([]);
  const [TFarray, setTFarray] = useState<TF[]>([]);
  const [FIBarray, setFIBarray] = useState<TF[]>([]);
  const [shortanswersarray, setshortanswersarray] = useState<TF[]>([]);
  const [type, settype] = useState("Mcq");

  useEffect(() => {
    setFormState("initial");
    setMcqarray([]);
    setTFarray([]);
    setFIBarray([]);
    setshortanswersarray([]);
  }, [type]);

  const { append, setMessages, isLoading } = useChat({
    api: `/api/${type}`,
    body: {
      classid: "forms",
    },
    onResponse: (res) => {
      setFormState("loading");
      if (res.status === 429) {
        console.log("You are being rate limited. Please try again later.");
      }
    },
    onFinish: (res) => {
      console.log(res);
      setMessages([]);

      const toolInvocation = res.toolInvocations && res.toolInvocations[0];

      if (toolInvocation) {
        const questionsArray = toolInvocation.args.questions;
        switch (toolInvocation.toolName) {
          case "create_mcq":
            setMcqarray(questionsArray);
            break;
          case "create_true_or_false":
            setTFarray(questionsArray);
            break;
          case "Create_fill_in_the_blanks":
            setFIBarray(questionsArray);
            break;
          case "Create_short_question_and_answer":
            setshortanswersarray(questionsArray);
            break;
          default:
            console.warn("Unknown toolName:", toolInvocation.toolName);
        }
      }

      setFormState("final");
      console.log("Successfully generated completion!");
    },
    
    onError: (error) => {
      setFormState("Error");
      console.log("There was a Error in your request");

      if (error.message === "Please subscribe to use this feature") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Please upgrade your subscription to create more you have used your daily limit.",
          action: (
            <Link href={"/dashboard/billing"}>
              <ToastAction altText="Upgrade">Upgrade</ToastAction>
            </Link>
          ),
        });
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      text: "",
      noquestions: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormState("loading");
    settopic(values.topic);
    setnoquestions(values.noquestions);
    setdifficulty(values.difficulty);
    setassignmentname(values.name);

    if (type === "Mcq") {
      const prompt = `extract the text related to the topic ${values.topic} and create ${values.noquestions} ${values.difficulty} mcq questions the text is = ${values.text}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else if (type === "TF") {
      const prompt = `extract the text related to the topic ${values.topic} and create ${values.noquestions} ${values.difficulty} true or false questions the text is = ${values.text}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else if (type === "Fillinblanks") {
      const prompt = `extract the text related to the topic ${values.topic} and create ${values.noquestions} ${values.difficulty} Fill in the blanks questions the text is = ${values.text}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else if (type === "Shortanswers") {
      const prompt = `extract the text related to the topic ${values.topic} and create ${values.noquestions} ${values.difficulty} short question and answer type question the text is = ${values.text}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }

  return (
    <div className={`${styles.grd} p-4`}>
      <div className={`p-1 ${styles.grd1} `}>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium">Text</h3>
            <p className="text-sm text-muted-foreground">
              Create Quix from just Text
            </p>
          </div>
          <div
            className={`flex space-x-2 inline-flex  justify-center rounded-md bg-muted p-1 text-muted-foreground place-items-center ${styles.tabs} mb-4`}
          >
            <div
              onClick={() => {
                settype("Mcq");
                setFormState("initial");
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                type === "Mcq"
                  ? "hover:bg-muted bg-background text-foreground shadow-sm"
                  : "hover:bg-transparent ",
                "justify-start cursor-pointer"
              )}
            >
              Mcq
            </div>
            <div
              onClick={() => {
                settype("TF");
                setFormState("initial");
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                type === "TF"
                  ? "hover:bg-muted bg-background text-foreground shadow-sm"
                  : "hover:bg-transparent ",
                "justify-start cursor-pointer "
              )}
            >
              True&nbsp;or&nbsp;false
            </div>
            <div
              onClick={() => {
                settype("Fillinblanks");
                setFormState("initial");
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                type === "Fillinblanks"
                  ? "hover:bg-muted bg-background text-foreground shadow-sm"
                  : "hover:bg-transparent ",
                "justify-start cursor-pointer"
              )}
            >
              Fill&nbsp;in&nbsp;blanks
            </div>
            <div
              onClick={() => {
                settype("Shortanswers");
                setFormState("initial");
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                type === "Shortanswers"
                  ? "hover:bg-muted bg-background text-foreground shadow-sm"
                  : "hover:bg-transparent ",
                "justify-start cursor-pointer"
              )}
            >
              Short&nbsp;answers
            </div>
          </div>
          <Separator className="w-3/6" />
        </div>
        <div className={styles.maxcont}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex:Assignment 6"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter ther Assignment name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the topic name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the topic to find in the text."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the topic related to the text
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the text hear"
                        // className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the content properly
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noquestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of questions"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the number of questions you want to generate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">medium</SelectItem>
                        <SelectItem value="hard">hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Controll the difficulty of the questions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={`${styles.btsub}`}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
      {type === "Mcq" ? (
        <McqEditor
          formState={formState}
          completion={Mcqarray}
          querydata={type}
          topic={topic}
          noquestions={noquestions}
          difficulty={difficulty}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : type === "TF" ? (
        <TFEditor
          difficulty={difficulty}
          noquestions={noquestions}
          topic={topic}
          querydata={type}
          completion={TFarray}
          formState={formState}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : type === "Fillinblanks" ? (
        <FillinblanksEditor
          difficulty={difficulty}
          noquestions={noquestions}
          topic={topic}
          querydata={type}
          completion={FIBarray}
          formState={formState}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : type === "Shortanswers" ? (
        <Shortanswerseditor
          difficulty={difficulty}
          noquestions={noquestions}
          topic={topic}
          querydata={type}
          completion={shortanswersarray}
          formState={formState}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : null}
    </div>
  );
}
