"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import React from "react";
import { toast } from "sonner";

const InviteButton = () => {
  const { projectId } = useProject();
  const [open, setOpen] = React.useState(false);
  const [inviteUrl, setInviteUrl] = React.useState("");

  React.useEffect(() => {
    setInviteUrl(`${window.location.origin}/join/${projectId}`);
  }, [projectId]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Ask them to copy and past this link
          </p>
          <Input
            className="mt-4"
            readOnly
            onClick={() => {
              void navigator.clipboard
                .writeText(`${window.location.origin}/join/${projectId}`)
                .then(() => toast.success("Copied to clipboard"))
                .catch((error: unknown) => {
                  console.error("Failed to copy invite link", error);
                  toast.error("Failed to copy invite link");
                });
            }}
            value={inviteUrl}
          />
        </DialogContent>
      </Dialog>
      <Button size="sm" onClick={() => setOpen(true)}>
        Invite Members
      </Button>
    </>
  );
};

export default InviteButton;
