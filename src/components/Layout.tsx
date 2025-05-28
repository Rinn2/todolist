
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import TaskList from "./TaskList";
import CategoryList from "./CategoryList";
import Statistics from "./Statistics";
import Settings from "./Settings";

const Layout: React.FC = () => {
  const { settings, updateSettings } = useTaskContext();
  const [activeTab, setActiveTab] = useState("tasks");

  const toggleTheme = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateSettings({ ...settings, theme: newTheme });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary">ToDoList App</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${settings.theme === "light" ? "dark" : "light"} mode`}
          >
            {settings.theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 w-full max-w-md mx-auto">
            <TabsTrigger value="tasks" data-value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="categories" data-value="categories">Categories</TabsTrigger>
            <TabsTrigger value="statistics" data-value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="settings" data-value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="mt-6 fade-in">
            {activeTab === "tasks" && <TaskList />}
            {activeTab === "categories" && <CategoryList />}
            {activeTab === "statistics" && <Statistics />}
            {activeTab === "settings" && <Settings />}
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Layout;
