import { ToastExample } from "@/components/examples/toast-example";

export default function ToastDemoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Toast Notifications Demo</h1>
      <p className="mb-6">
        This page demonstrates how to use toast notifications in your application.
        Click the buttons below to see different types of toast notifications.
      </p>
      <ToastExample />
    </div>
  );
}
