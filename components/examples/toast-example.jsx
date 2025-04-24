"use client"

import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function ToastExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Toast Notifications Example</h2>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => toast.success("Success notification!")}
          className="bg-green-500 hover:bg-green-600"
        >
          Show Success Toast
        </Button>

        <Button
          onClick={() => toast.error("Error notification!")}
          className="bg-red-500 hover:bg-red-600"
        >
          Show Error Toast
        </Button>

        <Button
          onClick={() => {
            const loadingToast = toast.loading("Loading...");
            setTimeout(() => {
              toast.dismiss(loadingToast);
              toast.success("Loading complete!");
            }, 2000);
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Show Loading Toast
        </Button>

        <Button
          onClick={() =>
            toast("Custom notification!", {
              icon: '🚀',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            })
          }
          className="bg-purple-500 hover:bg-purple-600"
        >
          Show Custom Toast
        </Button>
      </div>
    </div>
  );
}
