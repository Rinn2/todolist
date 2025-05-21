
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { SortOption } from "@/lib/types";

const Settings: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useTaskContext();

  const handleThemeChange = () => {
    updateSettings({
      ...settings,
      theme: settings.theme === "light" ? "dark" : "light",
    });
  };

  const handleDefaultSortChange = (value: string) => {
    updateSettings({
      ...settings,
      defaultSort: value as SortOption,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun size={20} />
              <Switch
                checked={settings.theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
              <Moon size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Display</CardTitle>
          <CardDescription>Set default task display options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Default Sort Order</Label>
            <RadioGroup
              value={settings.defaultSort}
              onValueChange={handleDefaultSortChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date">Date (newest first)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="priority" id="priority" />
                <Label htmlFor="priority">Priority (high to low)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="status" id="status" />
                <Label htmlFor="status">Status (not started → done)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your application data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reset all data including tasks, categories, and settings. This action cannot be undone.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Reset All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your tasks, categories, and reset all settings.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetAllData}>
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ToDoList App - Version 1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            A task management application with local storage, status tracking, priorities, and categories.
            All data is stored locally in your browser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
