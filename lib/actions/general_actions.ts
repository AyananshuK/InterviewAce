"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { getCurrentUser } from "./auth_action";
import { FieldPath } from "firebase-admin/firestore";

export async function getInterviewByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();
  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviewsByOthers(
  params: GetLatestInterviewsParams
): Promise< Omit<Interview, "userId">[] | null> {
  const { userId, limit = 18 } = params;
  const interviewsSnapshot = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();
  const interviews =  interviewsSnapshot.docs.map((doc) => {
    const data = doc.data();
    const {userId, ...restOfData} = data;
    return {
      id: doc.id,
      ...restOfData
    } as Omit<Interview, "userId">;
  })
  return interviews;
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interviews = await db.collection("interviews").doc(id).get();
  return interviews.data() as Interview | null;
}

export async function createFeedback(feedbackParams: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = feedbackParams;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out. 

        **Crucial Rule:**
        - **If the transcript is empty, or if it contains only very short, non-substantive utterances (e.g., "hello", "okay", "...", "interviewer: please begin", "candidate(user): thanks"), it means there is not enough content to provide a meaningful evaluation. In such cases, give a concise explanation (e.g., "Insufficient transcript for evaluation") in feedback fields (strengths, areasForImprovement, finalAssessment, comment) and give 0 scores.**
        - **Only provide scores and detailed feedback if there is genuine conversational exchange from the candidate(user).**
        
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getInterviewsFromCurrentUserFeedbacks(
  userId: string
): Promise< Omit<Interview, "userId">[] | null> {
  if(!userId){
    console.error("No user is logged in");
    return [];
  }

  const feedbacks = await db
    .collection("feedback")
    .where("userId", "==", userId)
    .get();

  const interviewIds = new Set();
  feedbacks.docs.forEach((feedback) => {
    const interviewId = feedback.data().interviewId;
    if(interviewId){
      interviewIds.add(interviewId);
    }
  })

  const uniqueInterviewIds = Array.from(interviewIds);
  if (uniqueInterviewIds.length === 0) {
    console.error("No feedbacks");
    return [];
  }

  const interviews : Omit<Interview, "userId">[] = [];
  const CHUNK_SIZE = 30;

  for (let i = 0; i < uniqueInterviewIds.length; i += CHUNK_SIZE) {
    const idChunk = uniqueInterviewIds.slice(i, i + CHUNK_SIZE);

    const interviewSnapshots = await db
      .collection("interviews")
      .where(FieldPath.documentId(), "in", idChunk)
      .get();

    interviewSnapshots.docs.forEach((doc) => {
      const data = doc.data();
      const {userId, ...restOfData} = data;
      interviews.push({
        id: doc.id,
        ...restOfData
      } as Omit<Interview, "userId">);
    });
  }

  return interviews;
}

export async function storeResumeInDB(params: resumeUrlAndId) {
  if (!params.userId) {
    return {
      success: false,
      message: "Failed to store data: User not authenticated",
    };
  }

  try {
    await db
      .collection("users")
      .doc(params.userId)
      .set(
        { resumeUrl: params.pdfUrl, resumePublicId: params.public_id },
        { merge: true }
      );
    return { success: true, message: "Successfully stored" };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to store data: ${error.message}`,
    };
  }
}

export async function getResumeByUserId(
  userId: string
): Promise<resumeUrlAndId | null> {
  const user = await getCurrentUser();
  if (user) {
    if (user.resumeUrl && user.resumePublicId){
      return {
        pdfUrl: user.resumeUrl,
        public_id: user.resumePublicId,
      };
    }
  }
  return null;
}

