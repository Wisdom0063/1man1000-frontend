"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Download, X } from "lucide-react";

interface CampaignAssetModalProps {
  assetUrl: string;
  campaignTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignAssetModal({
  assetUrl,
  campaignTitle,
  isOpen,
  onClose,
}: CampaignAssetModalProps) {
  const isVideo = assetUrl.match(/\.(mp4|webm|ogg)$/i);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = assetUrl;
    link.download = `${campaignTitle}-asset`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{campaignTitle} - Campaign Asset</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            {isVideo ? (
              <video
                src={assetUrl}
                controls
                className="w-full max-h-[60vh] object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={assetUrl}
                alt={campaignTitle}
                className="w-full max-h-[60vh] object-contain"
              />
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Asset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
