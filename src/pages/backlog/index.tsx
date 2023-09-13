/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import { IssueItem } from "./BacklogItem";
import type { Issue } from "@prisma/client";
import { prisma } from "~/server/db";
import Modal from "./addModal";

interface MyPageProps {
  sprintIssues: Issue[];
  productIssues: Issue[];
  teamId: string;
}

export default function Backlog({
  sprintIssues,
  productIssues,
  teamId,
}: MyPageProps) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Head>
        <title>product and sprint backlogs</title>
        <meta name="" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="m-5 flex flex-row">
          <div className="flex-auto text-lg">Sprint Backlog</div>
          <div className="relative flex-auto">
            <button
              className="absolute right-2 top-0 rounded-full bg-gray-800 px-4 py-2  text-white shadow-lg"
              onClick={() => setShow(true)}
            >
              +
            </button>
          </div>
          <Modal onClose={() => setShow(false)} show={show} teamId={teamId} />
        </div>
        <div className="page border border-solid border-blue-500 px-10 py-10">
          {sprintIssues
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((issue, index) => (
              <div className="dropped-issue" key={index}>
                <IssueItem issue={issue} />
              </div>
            ))}
        </div>

        <div className="m-5 flex flex-row">
          <div className="flex-auto text-lg">Product Backlog</div>
          <div className="relative flex-auto">
            <button
              className="absolute right-2 top-0 rounded-full bg-gray-800 px-4 py-2  text-white shadow-lg"
              onClick={() => setShow(true)}
            >
              +
            </button>
          </div>
        </div>
        <div className="page border border-solid border-red-500 px-10 py-10">
          {productIssues
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((issue, index) => (
              <div className="dropped-issue" key={index}>
                <IssueItem issue={issue} />
              </div>
            ))}
        </div>
      </main>
    </>
  );
}

// This needs to be added to every page with current Next Auth implementation
// Middleware is not supported for database sessions
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (!user?.teamId) {
    return;
  }

  const sprintIssues = await prisma.issue.findMany({
    select: {
      id: true,
      status: true,
      backlog: true,
      summary: true,
      teamId: true,
    },
    where: {
      teamId: user.teamId,
      backlog: "sprint",
    },
  });

  const productIssues = await prisma.issue.findMany({
    select: {
      id: true,
      status: true,
      backlog: true,
      summary: true,
      teamId: true,
    },
    where: {
      teamId: user.teamId,
      backlog: "product",
    },
  });

  const teamId = user.teamId;

  return {
    props: {
      sprintIssues,
      productIssues,
      teamId,
    },
  };
}
