import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CloudTasksClient } from '@google-cloud/tasks';

export async function POST(req: Request): Promise<void | Response> {
    const { classroomId, documentId, type } = await req.json();

    if (!classroomId) {
        return new Response("Please provide classroomId", { status: 400 });
    }

    if (!documentId) {
        return new Response("Please provide documentId", { status: 400 });
    }

    if (!type) {
        return new Response("Please provide type", { status: 400 });
    }

    const session = cookies().get("session")?.value || "";

    if (!session) {
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    try {


        if (!process.env.FIREBASE_PRIVATE_KEY && !process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL && !process.env.FIREBASE_CLOUD_FUNCTION_MCQ && !process.env.FIREBASE_CLOUD_FUNCTION_SHORTANSWER) {

            return new Response("Please provide firebase credentials", { status: 400 });
        }

        const client = new CloudTasksClient({
            credentials: {
                private_key: process.env.FIREBASE_PRIVATE_KEY,
                client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
            }
        });

        const project = process.env.FIREBASE_QUEUE_PROJECT || '';
        const location = process.env.FIREBASE_PROCESSING_LOCATION || '';
        const queue = process.env.FIREBASE_PROCESSING_QUEUE || '';
        const parent = client.queuePath(project, location, queue);
        var url = "";


        if (type === "Shortanswers") {
            url = process.env.FIREBASE_CLOUD_FUNCTION_SHORTANSWER || "";

        }
        else {
            url = process.env.FIREBASE_CLOUD_FUNCTION_MCQ || "";
        }


        // Define the task payload
        const payload = { classroomId, documentId };
        const task = {
            httpRequest: {
                httpMethod: 'POST' as 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            },
        };

        // Enqueue the task
        const [response] = await client.createTask({ parent, task });
        console.log(`Task created: ${response.name}`);

        return NextResponse.json({ message: 'Task created successfully' }, { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response('Failed to create task', { status: 500 });
    }
}
