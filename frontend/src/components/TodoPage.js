import React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import ColorSchemeToggle from "./ColorSchemeToggle";
import { fetchTasks, createTask, updateTask, deleteTask } from "./ApiService";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await fetchTasks();
      setTasks(tasks);
      setLoading(false);
    };

    getTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask) return;
    const task = { title: newTask, completed: false };
    const createdTask = await createTask(task);
    setTasks([...tasks, createdTask]);
    setNewTask("");
  };

  const handleUpdateTask = async () => {
    if (!newTask || !editTask) return;
    const task = { title: newTask, completed: false };
    await updateTask(editTask.id, task);
    setTasks(tasks.map((t) => (t.id === editTask.id ? { ...t, ...task } : t)));
    setEditTask(null);
    setNewTask("");
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = async (id, completed) => {
    const updatedTask = { ...tasks.find((task) => task.id === id), completed };
    await updateTask(id, updatedTask);
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "complete") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return false;
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: "rgba(255 255 255 / 0.2)",
        [theme.getColorSchemeSelector("dark")]: {
          backgroundColor: "rgba(19 19 24 / 0.4)",
        },
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        width: "100%",
        px: 2,
      })}
    >
      <Box
        component="header"
        sx={{
          py: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            gap: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton variant="soft" color="primary" size="sm">
            <ChecklistRoundedIcon />
          </IconButton>
          <Typography level="title-lg">To-Do List</Typography>
        </Box>
        <ColorSchemeToggle />
      </Box>
      <Box
        component="main"
        sx={{
          px: {
            xs: 2,
            md: 12,
            lg: 20,
          },
          my: "auto",
          pb: 5,
          pt: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          gap={3}
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Input
            sx={{ borderRadius: "lg", py: 1, flex: 2 }}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={editTask ? "Edit Task" : "Add Task"}
            endDecorator={
              <IconButton
                aria-label="Add task"
                size="md"
                onClick={editTask ? handleUpdateTask : handleCreateTask}
              >
                <AddCircleRoundedIcon />
              </IconButton>
            }
          />
          <Select
            defaultValue="all"
            sx={{ flex: 1, borderRadius: "lg", py: 2 }}
            onChange={(event, newValue) => setFilter(newValue)}
          >
            <Option value="all">All</Option>
            <Option value="complete">Complete</Option>
            <Option value="incomplete">Incomplete</Option>
          </Select>
        </Box>
        <Divider>TASKS</Divider>
        <Stack gap={4} sx={{ mt: 2 }}>
          <Stack gap={2}>
            {filteredTasks
              .slice()
              .reverse()
              .map((task, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    "& > div": { p: 2, borderRadius: "md", display: "flex" },
                  }}
                >
                  <Sheet variant="outlined">
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Checkbox
                        label={task.title}
                        checked={task.completed}
                        onChange={() =>
                          handleToggleComplete(task.id, !task.completed)
                        }
                        style={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      />
                      <Box sx={{ display: "flex" }}>
                        <IconButton
                          aria-label="Edit task"
                          onClick={() => {
                            setEditTask(task);
                            setNewTask(task.title);
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete task"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Sheet>
                </Box>
              ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
