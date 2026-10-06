import { renderHook, waitFor } from '@testing-library/react';
import { useAccueilCfp } from '../useAccueilCfp';
import useApi from '../Api';

// Mock du hook useApi
jest.mock('../Api');

describe('useAccueilCfp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch accueil data successfully', async () => {
    const mockData = {
      status: 200,
      en_cours: 3,
      total_trained: 0,
      encaissees: 60262000,
      impayees: 168549432,
      nonCloture: 46,
      today_sessions: [],
      encours_projects: [],
      reservations: []
    };

    const mockCallApi = jest.fn().mockResolvedValue(mockData);
    useApi.mockReturnValue({
      loading: false,
      error: null,
      data: [],
      callApi: mockCallApi
    });

    const { result } = renderHook(() => useAccueilCfp());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    expect(mockCallApi).toHaveBeenCalledWith('/accueilCfp');
  });

  it('should handle API errors', async () => {
    const mockError = new Error('Network error');
    const mockCallApi = jest.fn().mockRejectedValue(mockError);
    
    useApi.mockReturnValue({
      loading: false,
      error: mockError.message,
      data: [],
      callApi: mockCallApi
    });

    const { result } = renderHook(() => useAccueilCfp());

    await waitFor(() => {
      expect(result.current.error).toBe(mockError.message);
      expect(result.current.data).toBe(null);
    });
  });
});
