"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import { readStreamableValue } from "ai/rsc";
import React from "react";
import { askQuestion } from "./actions";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFileReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    if (!project?.id) return;
    setAnswer("");
    setFileReferences([]);
    e.preventDefault();
    setLoading(true);

    const { output, filesReferences } = await askQuestion(question, project.id);
    setOpen(true);
    setFileReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vm]">
          <DialogHeader className="flex items-center gap-2">
            <DialogTitle>
              <img src="/logo.svg" alt="RepoBrain" width={40} height={40} />
            </DialogTitle>
            <Button
              disabled={saveAnswer.isPending}
              variant="outline"
              onClick={() => {
                saveAnswer.mutate(
                  {
                    projectId: project!.id,
                    question,
                    answer,
                    filesReferences,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Answer Saved!");
                    },
                    onError: () => {
                      toast.error("Failed to save answer!");
                    },
                  },
                );
              }}
            >
              Save Answer
            </Button>
          </DialogHeader>

          <MDEditor.Markdown
            source={answer}
            className="h-full! max-h-[40vh] max-w-[70vm] overflow-scroll"
          />
          <CodeReferences filesReferences={filesReferences} />

          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask RepoBrain</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={loading}>
              Ask RepoBrain!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
