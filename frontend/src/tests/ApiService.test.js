import { fetchTasks, createTask, updateTask, deleteTask } from '../components/ApiService';
import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock;

const baseUrl = 'http://127.0.0.1:8000/api/tasks/';
const mockTasks = [
  { id: 1, title: 'Study Python', completed: true },
  { id: 2, title: 'Finish college report', completed: false },
];

describe('ApiService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('fetchTasks makes a GET request and returns data', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockTasks));

    const tasks = await fetchTasks();

    expect(tasks).toEqual([
      { id: 1, title: 'Study Python', completed: true },
      { id: 2, title: 'Finish college report', completed: false },
    ]);
    expect(fetch).toHaveBeenCalledWith(baseUrl);
  });

  test('createTask makes a POST request and returns data', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockTasks[0]));

    const task = await createTask(mockTasks[0]);

    expect(task).toEqual({ id: 1, title: 'Study Python', completed: true });
    expect(fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockTasks[0]),
    });
  });

  test('updateTask makes a PUT request and returns data', async () => {
    const updatedTask = { ...mockTasks[0], title: 'Study Java' };
    fetch.mockResponseOnce(JSON.stringify(updatedTask));

    const task = await updateTask(updatedTask.id, updatedTask);

    expect(task).toEqual(updatedTask);
    expect(fetch).toHaveBeenCalledWith(`${baseUrl}${updatedTask.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
  });

  test('deleteTask makes a DELETE request', async () => {
    fetch.mockResponseOnce('');

    await deleteTask(mockTasks[0].id);

    expect(fetch).toHaveBeenCalledWith(`${baseUrl}${mockTasks[0].id}/`, {
      method: 'DELETE',
    });
  });
});