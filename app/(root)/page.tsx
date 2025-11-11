import InterviewCard from "@/components/interviewCard";
import { Button } from "@/components/ui/button";
import UploadResume from "@/components/uploadResume";
import { getCurrentUser } from "@/lib/actions/auth_action";
import {
  getInterviewByUserId,
  getInterviewsFromCurrentUserFeedbacks,
  getLatestInterviewsByOthers,
} from "@/lib/actions/general_actions";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, userTakenInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getInterviewsFromCurrentUserFeedbacks(user?.id!),
    await getLatestInterviewsByOthers({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews && userInterviews?.length > 0;
  const otherInterviews = latestInterviews && latestInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get interview ready with AI powered practice and feedback</h2>
          <p className="text-lg">
            Pratice on real interview questions & get instant feedback
          </p>

          <div className="flex w-fit items-center rounded-full bg-primary-200 min-h-10">
            <Button asChild className="btn-primary">
              <Link href="/interview/form">Generate an interview</Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link href="/interview/voice">
                <img src="/microphone.svg" alt="mic icon" className="h-5 w-5" />{" "}
              </Link>
            </Button>
          </div>

          {user && <UploadResume pdfLink={user.resumeUrl} />}
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven't generated any interview yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Interviews Attempted</h2>
        <div className="interviews-section">
          {userTakenInterviews ? (
            userTakenInterviews.map((interview) => (
              <InterviewCard
                {...interview}
                userId={user?.id!}
                key={interview.id}
              />
            ))
          ) : (
            <p>You haven't taken any interview yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Other Available Interviews</h2>
        <div className="interviews-section">
          {otherInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard
                {...interview}
                userId={user?.id!}
                key={interview.id}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
