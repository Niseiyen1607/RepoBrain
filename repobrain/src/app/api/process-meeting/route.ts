import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  projectId: z.string(),
  meetingId: z.string(),
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsedBody = bodyParser.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { projectId, meetingId } = parsedBody.data;
  const meeting = await db.meeting.findFirst({
    where: {
      id: meetingId,
      projectId,
      project: {
        userToProjects: {
          some: { userId },
        },
      },
    },
    select: { meetingUrl: true },
  });

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  try {
    const { summaries } = await processMeeting(meeting.meetingUrl);
    await db.$transaction([
      db.issue.createMany({
        data: summaries.map((summary) => ({
          start: summary.start,
          end: summary.end,
          gist: summary.gist,
          headline: summary.headline,
          summary: summary.summary,
          meetingId,
        })),
      }),
      db.meeting.update({
        where: { id: meetingId },
        data: {
          status: "COMPLETED",
          ...(summaries[0]?.headline ? { name: summaries[0].headline } : {}),
        },
      }),
    ]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (processingError) {
    console.error("Meeting processing failed", processingError);
    return NextResponse.json(
      { error: "Meeting processing failed" },
      { status: 500 },
    );
  }
}
