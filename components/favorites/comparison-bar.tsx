"use client";

import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ComparisonBarProps {
  selectedCount: number;
  onClear: () => void;
  onCompare: () => void;
}

export default function ComparisonBar({
  selectedCount,
  onClear,
  onCompare,
}: ComparisonBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-2xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                aria-label="Clear selection"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <p className="font-semibold">
                  {selectedCount} {selectedCount === 1 ? 'space' : 'spaces'} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedCount < 2 && "Select at least 2 spaces to compare"}
                  {selectedCount === 2 && "Select 1 more space (max 3)"}
                  {selectedCount === 3 && "Maximum 3 spaces selected"}
                </p>
              </div>
            </div>

            <Button
              onClick={onCompare}
              disabled={selectedCount < 2}
              className="gap-2"
            >
              Compare Spaces
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
