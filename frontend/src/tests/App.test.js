import { render, screen } from '@testing-library/react';
import App from '../App';
import * as ApiService from '../components/ApiService';

describe('App', () => {
  beforeEach(() => {
    const mockFetchTasks = jest.fn().mockResolvedValue([
      {
        "id": 1,
        "title": "Study Python",
        "completed": true
      },
      {
        "id": 2,
        "title": "Finish college report",
        "completed": false
      },
    ]);
    ApiService.fetchTasks = mockFetchTasks;
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
      })),
    });
  });
  test('renders app name', async () => {
    render(<App />);
    const appName = await screen.findByText(/to-do list/i);
    expect(appName).toBeInTheDocument();
  });
});