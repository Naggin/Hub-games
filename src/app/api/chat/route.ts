import { handleCompanionChat } from "@/lib/ai/companion";

export async function POST(req: Request) {
  try {
    const { messages, persona } = (await req.json()) as {
      messages: Parameters<typeof handleCompanionChat>[0];
      persona?: Parameters<typeof handleCompanionChat>[1];
    };

    return handleCompanionChat(messages, persona ?? "recommender");
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
