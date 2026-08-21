import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
import { SourceCode } from "eslint";
import { Octokit } from "octokit";

const getFileCount = async (
  path: string,
  octokit: Octokit,
  githubOwner: string,
  githubRepo: string,
  acc: number = 0,
) => {
  const { data } = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path,
  });

  if (!Array.isArray(data) && data.type === "file") {
    return acc + 1;
  }

  if (Array.isArray(data)) {
    let fileCount = 0;
    const directories: string[] = [];

    for (const item of data) {
      if (item.type === "dir") {
        directories.push(item.path);
      } else {
        fileCount++;
      }
    }

    if (directories.length > 0) {
      const directoryCount = await Promise.all(
        directories.map((dirPath) =>
          getFileCount(dirPath, octokit, githubOwner, githubRepo, 0),
        ),
      );
      fileCount += directoryCount.reduce((acc, count) => acc + count, 0);
    }
    return acc + fileCount;
  }

  return acc;
};

export const parseGithubUrl = (url: string) => {
  const cleanUrl = url.replace(/\/$/, "").replace(/\.git$/, "");
  const parts = cleanUrl.split("/");

  if (parts.length < 2) throw new Error("Invalid GitHub URL");

  const repo = parts.pop();
  const owner = parts.pop();

  return { owner, repo };
};

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  const octokit = new Octokit({ auth: githubToken });
  const { owner, repo } = parseGithubUrl(githubUrl);

  if (!owner || !repo) {
    return 0;
  }

  const fileCount = await getFileCount("", octokit, owner, repo, 0);
  return fileCount;
};

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const cleanUrl = githubUrl.replace(/\/$/, "").replace(/\.git$/, "");

  const loader = new GithubRepoLoader(cleanUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN || "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const validExtensions = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".py",
    ".go",
    ".java",
    ".rs",
    ".cpp",
    ".c",
  ];

  const codeDocs = docs
    .filter((doc) => {
      const fileName = doc.metadata.source.toLowerCase();
      return validExtensions.some((ext) => fileName.endsWith(ext));
    })
    .slice(0, 20);

  console.log(
    `Indexation de ${codeDocs.length} fichiers de code essentiels...`,
  );

  const allEmbedding = await generateEmbeddings(codeDocs);

  await Promise.allSettled(
    allEmbedding.map(async (embedding, index) => {
      console.log(`processing ${index} of ${allEmbedding.length}`);
      if (!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });

      await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = (await summariseCode(doc)) || "";
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    }),
  );
};
