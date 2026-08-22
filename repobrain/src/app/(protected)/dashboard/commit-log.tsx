"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits, isLoading } = api.project.getCommits.useQuery({
    projectId,
  });
  return (
    <>
      {isLoading && (
        <ul className="space-y-6" aria-label="Loading commits">
          {[1, 2, 3].map((item) => (
            <li key={item} className="flex gap-x-4">
              <Skeleton className="mt-4 size-8 flex-none rounded-full" />
              <div className="flex-auto space-y-3 rounded-md p-3 ring-1 ring-gray-200">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-12 w-full" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && commits?.length === 0 && (
        <p className="text-sm text-gray-500">No commits found.</p>
      )}

      {!isLoading && commits && commits.length > 0 && (
        <ul className="space-y-6">
          {commits?.map((commit, commitIdx) => {
            return (
              <li key={commit.id} className="relative flex gap-x-4">
                <div
                  className={cn(
                    commitIdx === commits.length - 1 ? "h-6" : "-bottom=6",
                    "left=0 absolute top-0 flex w-6 justify-center",
                  )}
                >
                  <div className="w-px translate-x-1 bg-gray-200"></div>
                </div>

                <>
                  <img
                    src={commit.commitAuthorAvatar}
                    alt="commit avatar"
                    className="relative mt-4 size-8 flex-none rounded-full bg-gray-600"
                  />
                  <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
                    <div className="flex justify-between gap-x-4">
                      <Link
                        target="_blank"
                        href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                        className="p-y-0.5 text-xs leading-5 text-gray-500"
                      >
                        <span className="font-medium text-gray-900">
                          {commit.commitAuthorName}
                        </span>{" "}
                        <span className="inline-flex items-center">
                          commited
                          <ExternalLink className="ml-1 size-4" />
                        </span>
                      </Link>
                    </div>
                    <span className="font-semibold">
                      {commit.commitMessage}
                    </span>
                    <pre className="mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-500">
                      {commit.summary}
                    </pre>
                  </div>
                </>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default CommitLog;
