import Agent from "@/components/agent"
import { getCurrentUser } from "@/lib/actions/auth_action"


const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3>
        <Agent userName={user?.name} userId={user?.id} type="generate" />
      </h3>
    </>
  )
}

export default Page