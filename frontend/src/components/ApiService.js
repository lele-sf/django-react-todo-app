const baseUrl = 'http://127.0.0.1:8000/api/tasks/';

export const fetchTasks = async () => {
  const response = await fetch(baseUrl);
  return response.json();
};

export const createTask = async (task) => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
  }
};

export const updateTask = async (id, updatedTask) => {
  try {
    const response = await fetch(`${baseUrl}${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
  }
};

export const deleteTask = async (id) => {
  const response = await fetch(`${baseUrl}${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};