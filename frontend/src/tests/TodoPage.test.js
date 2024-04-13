import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CssVarsProvider } from "@mui/joy/styles";
import TodoPage from "../components/TodoPage";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../components/ApiService";

const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => <CssVarsProvider>{children}</CssVarsProvider>,
    ...options,
  });

jest.mock("../components/ApiService");

describe("TodoPage", () => {
  const mockTasks = [
    {
      id: 1,
      title: "Study Python",
      completed: true,
    },
    {
      id: 2,
      title: "Finish college report",
      completed: false,
    },
  ];
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        media: query,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
      })),
    });
    fetchTasks.mockResolvedValueOnce(mockTasks);
    createTask.mockResolvedValueOnce({
      id: 3,
      title: "Buy groceries",
      completed: false,
    });
    updateTask.mockResolvedValueOnce({
      id: 1,
      title: "Study Java",
      completed: true,
    });
    deleteTask.mockResolvedValueOnce({})
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders loading state initially", () => {
    render(<TodoPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders tasks", async () => {
    customRender(<TodoPage />);
    const task1 = await screen.findByText(/Study Python/i);
    const task2 = await screen.findByText(/Finish college report/i);
    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
  });

  test("creates a task", async () => {
    customRender(<TodoPage />);
    const input = await screen.findByPlaceholderText(/add task/i);
    const button = screen.getByTestId("AddCircleRoundedIcon");

    userEvent.type(input, "Buy groceries");
    userEvent.click(button);

    const newTask = await screen.findByText(/Buy groceries/i);

    expect(newTask).toBeInTheDocument();
  });

  test("updates a task", async () => {
    customRender(<TodoPage />);

    const editBtns = await screen.findAllByLabelText(/Edit task/i);

    userEvent.click(editBtns[0])

    const input = await screen.findByPlaceholderText(/Edit task/i);
    const button = screen.getByTestId("AddCircleRoundedIcon");

    userEvent.clear(input)
    userEvent.type(input, "Study Java")
    userEvent.click(button)

    const updatedTask = await screen.findByText(/Study Java/i);

    expect(updatedTask).toBeInTheDocument();
  });

  test("deletes a task", async () => {
    customRender(<TodoPage/>)
  
    const delBtns = await screen.findAllByLabelText(/Delete task/i)
    const lastTaskId = mockTasks[mockTasks.length - 1].id; 
  
    userEvent.click(delBtns[0])
  
    expect(deleteTask).toHaveBeenCalledWith(lastTaskId);
  })
});
