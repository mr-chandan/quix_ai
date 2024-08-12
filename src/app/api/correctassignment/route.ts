import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const functions = [
  {
    name: "assign_marks_for_each_studentAnswer",
    parameters: {
      type: "object",
      properties: {
        grade: {
          type: "array",
          description:
            "marks and remarks for each question in order of question",
          items: {
            type: "object",
            properties: {

              marks: {
                type: "number",
                description: "Marks for the particular studentAnswer",
              },
              remarks: {
                type: "string",
                description: "Remarks for the particular studentAnswer",
              },
            },
          },
        },
      },
      required: ["grade", "marks", "remarks"],
    },
  },
];

export async function POST(req: Request) {
  const { messages, classid } = await req.json();


  if (!classid) {
    return new Response("Please provide classid", { status: 401 });
  }

  if (!messages) {
    return new Response("Please provide messages", { status: 401 });
  }


  const session = cookies().get("session")?.value || "";

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }


  const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getuserdata`, {
    method: 'POST',
    body: JSON.stringify({ classid: classid }),
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `session=${session}`
    },
  });

  if (!authResponse.ok) {
    return new Response("There was a with auth", { status: 500 });
  }
  const { isPro, isCreated } = await authResponse.json();




  if (!isPro && isCreated) {
    return new Response("Please subscribe to use this feature", { status: 401 });
  }


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
      functions,
      // temperature:0,
      // top_p:0
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return new Response("there was a error", { status: 500 });
  }
}
