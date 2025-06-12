import Agent from "@/components/agent"
import { getCurrentUser } from "@/lib/actions/auth_action"


const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      {user && <h3>
        <Agent userName={user.name} userId={user.id} resumeUrl={user?.resumeUrl} type="generate" />
      </h3>}
    </>
  )
}

export default Page;
