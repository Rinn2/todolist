
import React from "react";
import { TaskProvider } from "@/context/TaskContext";
import Layout from "@/components/Layout";

const Index: React.FC = () => {
  return (
    <TaskProvider>
      <Layout />
    </TaskProvider>
  );
};

export default Index;
