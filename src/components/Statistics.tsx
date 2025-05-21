
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskContext } from "@/context/TaskContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const Statistics: React.FC = () => {
  const { statistics, categories } = useTaskContext();

  // Prepare data for status chart
  const statusData = [
    { name: "Not Started", value: statistics.byStatus["not-started"], color: "hsl(var(--status-not-started))" },
    { name: "In Progress", value: statistics.byStatus["in-progress"], color: "hsl(var(--status-in-progress))" },
    { name: "Done", value: statistics.byStatus["done"], color: "hsl(var(--status-done))" },
  ];

  // Prepare data for priority chart
  const priorityData = [
    { name: "Low", value: statistics.byPriority["low"], color: "hsl(var(--priority-low))" },
    { name: "Medium", value: statistics.byPriority["medium"], color: "hsl(var(--priority-medium))" },
    { name: "High", value: statistics.byPriority["high"], color: "hsl(var(--priority-high))" },
  ];

  // Prepare data for category chart
  const categoryData = categories.map(category => ({
    name: category.name,
    value: statistics.byCategory[category.id] || 0,
    color: category.color,
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{statistics.byStatus["done"]}</div>
            <div className="text-sm text-muted-foreground">
              {statistics.total > 0
                ? `${Math.round((statistics.byStatus["done"] / statistics.total) * 100)}% of all tasks`
                : "No tasks yet"
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{statistics.byStatus["in-progress"]}</div>
            <div className="text-sm text-muted-foreground">
              {statistics.total > 0
                ? `${Math.round((statistics.byStatus["in-progress"] / statistics.total) * 100)}% of all tasks`
                : "No tasks yet"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statistics.total > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {categoryData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tasks by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {statistics.total === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No tasks found. Add some tasks to see statistics!</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
