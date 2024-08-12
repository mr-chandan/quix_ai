"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useParams, useSearchParams } from "next/navigation";
import McqEditor from "./McqEditor";
import { useEffect, useState } from "react";
import TFEditor from "./TFeditor";
import FillinblanksEditor from "./FillinblanksEditor";
import { FunctionCallHandler } from "ai";
import { toast } from "@/components/ui/use-toast";
import Shortanswerseditor from "./Shortanswerseditor";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
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
  topic: z
    .string()
    .min(3, {
      message: "Topic must be at least 3 characters.",
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
  const { toast } = useToast();
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
  const params = useParams();
  const classid = params.classid;

  useEffect(() => {
    setFormState("initial");
    setMcqarray([]);
    setTFarray([]);
    setFIBarray([]);
    setshortanswersarray([]);
  }, [querydata]);

  const { append, setMessages, isLoading } = useChat({
    api: `/api/${querydata}`,
    body: {
      classid: classid,
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
      noquestions: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormState("loading");
    settopic(values.topic);
    setnoquestions(values.noquestions);
    setdifficulty(values.difficulty);
    setassignmentname(values.name);

    if (querydata === "Mcq") {
      const prompt = `create ${values.noquestions} ${values.difficulty} mcq about topic ${values.topic}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else if (querydata === "TF") {
      const prompt = `create ${values.noquestions} ${values.difficulty} true or false questions about topic ${values.topic}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else if (querydata === "Fillinblanks") {
      const prompt = `create ${values.noquestions} ${values.difficulty} Fill in the blanks question about topic ${values.topic}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else if (querydata === "Shortanswers") {
      const prompt = `create ${values.noquestions} ${values.difficulty} short question and answer type question about topic ${values.topic}`;
      setMessages([]);
      await append({ content: prompt, role: "user" });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Reload the page and try again later",
      });
      return;
    }
  }

  return (
    <div className={`${styles.grd}`}>
      <div className={`p-1 ${styles.grd1}`}>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium">Topic</h3>
            <p className="text-sm text-muted-foreground">
              Create Quix from just Topic name
            </p>
          </div>
          <Separator className="w-3/6" />
        </div>
        <div className={styles.maxcont}>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex:Assignment 6"
                        {...field}
                        autoComplete="off"
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
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter topic"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>
                      Explain your topic in 3 or 5 words for better results
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
      {querydata === "Mcq" ? (
        <McqEditor
          formState={formState}
          completion={Mcqarray}
          querydata={querydata}
          topic={topic}
          noquestions={noquestions}
          difficulty={difficulty}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : querydata === "TF" ? (
        <TFEditor
          difficulty={difficulty}
          noquestions={noquestions}
          topic={topic}
          querydata={querydata}
          completion={TFarray}
          formState={formState}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : querydata === "Fillinblanks" ? (
        <FillinblanksEditor
          difficulty={difficulty}
          noquestions={noquestions}
          topic={topic}
          querydata={querydata}
          completion={FIBarray}
          formState={formState}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : querydata === "Shortanswers" ? (
        <Shortanswerseditor
          difficulty={difficulty}
          noquestions={noquestions}
          topic={topic}
          querydata={querydata}
          completion={shortanswersarray}
          formState={formState}
          setFormState={setFormState}
          assignmentname={assignmentname}
        />
      ) : null}
    </div>
  );
}
