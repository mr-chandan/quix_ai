import { streamText, tool } from 'ai';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

export const runtime = 'edge';


export async function POST(req: Request): Promise<void | Response> {
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
    const createMCQTool = tool({
      description: 'Create true or false questions based on provided topic or given data.',
      parameters: z.object({
        questions: z.array(
          z.object({
            question: z.string().describe('The True or False question related to the topic or given data'),
            // options: z.array(z.string()).describe('The options for the question with the correct answer'),
            answer: z.string().describe('The correct answer (True or False) for the question'),
          })
        ),
      }),
    });


    const result = await streamText({
      model: google("models/gemini-1.5-pro-latest"),
      tools: {
        create_true_or_false: createMCQTool,
      },
      toolChoice: 'required',
      prompt: messages[0].content,
    });



    return result.toAIStreamResponse();

  } catch (error) {
    console.log(error);
    return new Response("there was a error", { status: 500 });
  }
}