"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import ElementStepper from "./element-cretion-stepper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function NewElement() {
  const [open, isOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ">Safe password list</h1>
        <div>
          <Dialog open={open} onOpenChange={isOpen} >
            <DialogTrigger asChild>
              {/* onClick={() => isOpen(true)} */}
              <Button>
                <Plus />
                New password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ElementStepper open={open}/>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default NewElement;
