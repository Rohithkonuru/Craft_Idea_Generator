import { CraftIdea, GenerateRequest, GenerateResponse, SavedCraftsResponse, HealthStatus } from '../types/craft';

const API_BASE = '/api';

export const api = {
  /**
   * Check backend health, database mode, and server Gemini AI configuration.
   * Completely safe and contains zero secret keys.
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend health check error, running in offline resilient mode', err);
      return {
        status: 'offline',
        database: 'json_fallback',
        gemini_configured: false,
      };
    }
  },

  /**
   * Generate structured DIY craft ideas through the Flask backend.
   * No API keys or credentials are ever sent from the frontend.
   */
  async generateIdeas(params: GenerateRequest): Promise<GenerateResponse> {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate craft ideas');
    }
    return data;
  },

  /**
   * Fetch all saved craft ideas from backend storage
   */
  async getSavedCrafts(): Promise<CraftIdea[]> {
    try {
      const res = await fetch(`${API_BASE}/crafts`);
      if (!res.ok) throw new Error('Failed to fetch saved crafts');
      const data: SavedCraftsResponse = await res.json();
      const serverCrafts = data.crafts || [];
      localStorage.setItem('cached_saved_crafts', JSON.stringify(serverCrafts));
      return serverCrafts;
    } catch (err) {
      console.warn('Could not reach backend crafts endpoint, loading from local cache', err);
      const cached = localStorage.getItem('cached_saved_crafts');
      return cached ? JSON.parse(cached) : [];
    }
  },

  /**
   * Save a craft idea to backend database with local storage backup
   */
  async saveCraft(craft: CraftIdea): Promise<CraftIdea> {
    try {
      const res = await fetch(`${API_BASE}/crafts/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(craft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save craft');
      
      const cached = localStorage.getItem('cached_saved_crafts');
      const list: CraftIdea[] = cached ? JSON.parse(cached) : [];
      if (!list.some(c => c.id === craft.id)) {
        list.unshift(data.craft || craft);
        localStorage.setItem('cached_saved_crafts', JSON.stringify(list));
      }
      return data.craft || craft;
    } catch (err) {
      console.warn('Failed to save to backend, saving to local cache instead', err);
      const cached = localStorage.getItem('cached_saved_crafts');
      const list: CraftIdea[] = cached ? JSON.parse(cached) : [];
      const updatedCraft = { ...craft, savedAt: new Date().toISOString() };
      if (!list.some(c => c.id === craft.id)) {
        list.unshift(updatedCraft);
        localStorage.setItem('cached_saved_crafts', JSON.stringify(list));
      }
      return updatedCraft;
    }
  },

  /**
   * Delete a saved craft idea
   */
  async deleteCraft(craftId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/crafts/${craftId}`, {
        method: 'DELETE',
      });
      const cached = localStorage.getItem('cached_saved_crafts');
      if (cached) {
        const list: CraftIdea[] = JSON.parse(cached);
        const filtered = list.filter(c => c.id !== craftId);
        localStorage.setItem('cached_saved_crafts', JSON.stringify(filtered));
      }
      return res.ok;
    } catch (err) {
      console.warn('Failed to delete on backend, removing from local cache', err);
      const cached = localStorage.getItem('cached_saved_crafts');
      if (cached) {
        const list: CraftIdea[] = JSON.parse(cached);
        const filtered = list.filter(c => c.id !== craftId);
        localStorage.setItem('cached_saved_crafts', JSON.stringify(filtered));
      }
      return true;
    }
  }
};
