import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/db";
import { type Issue } from "@prisma/client";
import Link from "next/link";

export default function Dashboard({
  username,
  recentIssues,
}: {
  username: string;
  recentIssues: Issue[];
}) {
  return (
    <div className="flex flex-grow justify-center bg-white px-48 py-48 dark:bg-slate-700 ">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          Welcome back to scroom, {username}
        </h1>
        <p className="mb-6 text-center text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
          Use the navigation options above to visit your team&apos;s scrum
          board, look at the issues in your backlog, and check who is in your
          team.
        </p>
        <h1 className="mb-4 pt-16 text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          Current Issues
        </h1>
        {recentIssues ? (
          recentIssues.map((issue) => (
            <span key={issue.id} className="text-white">
              {issue.summary}
            </span>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            No current issues. Create one in the{" "}
            <Link href="/backlogs" className="text-blue-500">
              backlog
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }

  if (!session.user?.teamId) {
    return {
      redirect: {
        destination: "/onboarding",
      },
    };
  }

  const recentIssues = await prisma.issue.findMany({
    where: {
      teamId: session.user.teamId,
    },
    select: {
      id: true,
      summary: true,
    },
    take: 5,
  });

  return {
    props: { username: session.user.name, recentIssues: recentIssues },
  };
}