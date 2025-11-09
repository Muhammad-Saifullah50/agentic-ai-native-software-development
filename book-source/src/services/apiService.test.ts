// book-source/src/services/apiService.test.ts
import { simulateScenario, getScenarios } from './apiService';

// Mock the fetch API
const mockFetch = jest.spyOn(global, 'fetch');

describe('apiService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('simulateScenario', () => {
    it('should successfully simulate a scenario and return nodes, edges, and simulationId', async () => {
      const mockResponse = {
        nodes: [{ id: '1', label: 'Node 1', type: 'agent', zone: 'perception', metadata: { description: 'desc', explanation: 'exp', principles: [] } }],
        edges: [{ id: 'e1-2', source: '1', target: '2', label: 'Edge 1-2', metadata: { explanation: 'exp' } }],
        simulationId: 'test-sim-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const scenarioText = 'test scenario';
      const scenarioType = 'default';
      const result = await simulateScenario(scenarioText, scenarioType);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioText, scenarioType }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the API response is not ok', async () => {
      const mockErrorData = { detail: 'Invalid scenario' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve(mockErrorData),
      } as Response);

      const scenarioText = 'invalid scenario';
      const scenarioType = 'default';

      await expect(simulateScenario(scenarioText, scenarioType)).rejects.toThrow('Invalid scenario');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw a network error if fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const scenarioText = 'test scenario';
      const scenarioType = 'default';

      await expect(simulateScenario(scenarioText, scenarioType)).rejects.toThrow(
        'Network error: Could not connect to the backend server. Please ensure the server is running.'
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw a generic error for other fetch failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Something went wrong'));

      const scenarioText = 'test scenario';
      const scenarioType = 'default';

      await expect(simulateScenario(scenarioText, scenarioType)).rejects.toThrow('Something went wrong');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getScenarios', () => {
    it('should successfully fetch scenarios', async () => {
      const mockResponse = [{ id: 's1', name: 'Scenario 1', description: 'Desc 1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getScenarios();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/scenarios');
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the API response is not ok', async () => {
      const mockErrorData = { detail: 'Failed to retrieve scenarios' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve(mockErrorData),
      } as Response);

      await expect(getScenarios()).rejects.toThrow('Failed to retrieve scenarios');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw a network error if fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(getScenarios()).rejects.toThrow(
        'Network error: Could not connect to the backend server. Please ensure the server is running.'
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw a generic error for other fetch failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Something went wrong'));

      await expect(getScenarios()).rejects.toThrow('Something went wrong');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
