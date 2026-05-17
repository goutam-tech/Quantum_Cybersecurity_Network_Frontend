import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockFile, mockUploadFile, mockAnalyze } from '../mocks/mockData';

vi.mock('../../api', () => ({
  api: {
    uploadFile: mockUploadFile,
    analyze: mockAnalyze,
  },
}));

import { Upload } from '../../components/Upload';

describe('Upload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('selects file correctly', () => {
    render(<Upload onAnalyzeComplete={vi.fn()} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(input.files?.[0].name).toBe('test.csv');
  });

  test('upload and analyze flow works', async () => {
    mockUploadFile.mockResolvedValue({});
    mockAnalyze.mockResolvedValue({});

    render(<Upload onAnalyzeComplete={vi.fn()} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });

    const btn = await screen.findByText(/Start Analysis/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalled();
    });

    await act(async () => {
      vi.advanceTimersByTime(2100); 
      await vi.runAllTimersAsync(); 
    });

    expect(mockAnalyze).toHaveBeenCalled();
  });

  test('calls onAnalyzeComplete after analysis finishes', async () => {
    mockUploadFile.mockResolvedValue({});
    mockAnalyze.mockResolvedValue({});

    const onComplete = vi.fn();
    render(<Upload onAnalyzeComplete={onComplete} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });

    const btn = await screen.findByText(/Start Analysis/i);
    fireEvent.click(btn);

    await waitFor(() => expect(mockUploadFile).toHaveBeenCalled());

    await act(async () => {
      vi.advanceTimersByTime(2100);
      await vi.runAllTimersAsync();
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('shows error if upload fails', async () => {
    mockUploadFile.mockRejectedValue(new Error('Upload failed'));

    render(<Upload onAnalyzeComplete={vi.fn()} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });

    const btn = await screen.findByText(/Start Analysis/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  test('shows error if analyze fails', async () => {
    mockUploadFile.mockResolvedValue({});
    mockAnalyze.mockRejectedValue(new Error('Analyze failed'));

    render(<Upload onAnalyzeComplete={vi.fn()} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });

    const btn = await screen.findByText(/Start Analysis/i);
    fireEvent.click(btn);

    await waitFor(() => expect(mockUploadFile).toHaveBeenCalled());

    await act(async () => {
      vi.advanceTimersByTime(2100);
      await vi.runAllTimersAsync();
    });

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  test('progress reaches 100 before analyze fires', async () => {
    mockUploadFile.mockResolvedValue({});
    mockAnalyze.mockReturnValue(new Promise(() => {}));

    render(<Upload onAnalyzeComplete={vi.fn()} />);

    const input = document.getElementById('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });

    const btn = await screen.findByText(/Start Analysis/i);
    fireEvent.click(btn);

    await waitFor(() => expect(mockUploadFile).toHaveBeenCalled());

    await act(async () => {
      vi.advanceTimersByTime(2100);
    });

    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});