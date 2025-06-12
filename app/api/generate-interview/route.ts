import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
import axios from "axios";
import pdfParse from "pdf-parse";

export async function GET() {
  return Response.json({ success: true, message: "Hi" }, { status: 200 });
}

export async function POST(request: Request) {
  const {
    type,
    role,
    level,
    techStack,
    amount,
    userId,
    coverImage,
    resumeUrl,
  } = await request.json();

  try {
    let prompt = `Prepare questions for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techStack}.
      The focus between behavioral and technical questions should lean towards: ${type}.
      The amount of questions required is: ${amount}.
      
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3", ...]
      
      Thank you!
    `;

    if (resumeUrl) {
      const response = await axios.get(resumeUrl, {
        responseType: "arraybuffer",
      });
      
      if (response.status !== 200) {
        return Response.json({ success: false, message: "Failed to fetch PDF"}, { status: response.status });
      }
    
      const parsed = await pdfParse(response.data);
      const resumeText = parsed.text;
      
      if (resumeText) {
        prompt = `Prepare questions for a job interview based on the candidate's resume and the job requirements.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStack}.
        The focus between behavioral and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.

        Resume (for personalization only, do not base all questions strictly on this):
        """
        ${resumeText}
        """
        
        Please return only the questions, without any additional text.
        Use the resume to personalize the questions (e.g., align them with skills, projects or experiences mentioned), but don't limit the scope to only resume content.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3", ...]
        
        Thank you!
      `;
      }
    }

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: prompt,
    });

    const interview = {
      role,
      type,
      level,
      techStack: techStack.split(/[,\s]+/),
      questions: JSON.parse(questions),
      userId: userId!,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
