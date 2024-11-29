"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import ElementStepper from "./element-cretion-stepper";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function NewElement({ title }: { title: string }) {
  const [open, isOpen] = useState(false);
  return (
    <div>
      <div className="flex max-md:flex-col justify-between items-center">
        <h1 className="text-[28px] font-bold ">{title}</h1>
        <div>
          <Dialog open={open} onOpenChange={isOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                New password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ElementStepper open={open} isOpen={isOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default NewElement;
