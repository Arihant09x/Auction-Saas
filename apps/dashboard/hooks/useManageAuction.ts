import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Helper to universally catch token expiries and bounce the user
const handleAuthError = (res?: Response) => {
    if (!res || res.status === 401 || res.status === 403) {
        useAuthStore.getState().logout();
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/login`;
    }
};

const isTokenExpired = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3 || !parts[1]) return true;
        const payload = JSON.parse(atob(parts[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};

// --- FETCH AUCTION DETAILS ---
const fetchAuctionDetails = async (auctionId: string, token: string) => {
    if (!token || !auctionId) return null;
    
    if (isTokenExpired(token)) {
        handleAuthError();
        throw new Error("Token expired");
    }

    const res = await fetch(`${API_URL}/auction/${auctionId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        handleAuthError(res);
        throw new Error("Failed to fetch auction details");
    }
    const resData = await res.json();
    return resData.data || resData;
};

export function useAuctionDetails(auctionId: string) {
    const { firebaseToken } = useAuthStore();
    return useQuery({
        queryKey: ['auction', auctionId],
        queryFn: () => fetchAuctionDetails(auctionId, firebaseToken!),
        enabled: !!firebaseToken && !!auctionId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// --- FETCH TEAMS ---
const fetchTeams = async (auctionId: string, token: string) => {
    if (!token || !auctionId) return [];
    const res = await fetch(`${API_URL}/team?auctionId=${auctionId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        handleAuthError(res);
        throw new Error("Failed to fetch teams");
    }
    const resData = await res.json();
    return resData.data || [];
};

export function useTeams(auctionId: string) {
    const { firebaseToken } = useAuthStore();
    return useQuery({
        queryKey: ['teams', auctionId],
        queryFn: () => fetchTeams(auctionId, firebaseToken!),
        enabled: !!firebaseToken && !!auctionId,
    });
}

// --- FETCH PLAYERS ---
const fetchPlayers = async (auctionId: string, token: string) => {
    if (!token || !auctionId) return [];
    const res = await fetch(`${API_URL}/player?auctionId=${auctionId}&limit=99999`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        handleAuthError(res);
        throw new Error("Failed to fetch players");
    }
    const resData = await res.json();
    return resData.data || [];
};

export function usePlayers(auctionId: string) {
    const { firebaseToken } = useAuthStore();
    return useQuery({
        queryKey: ['players', auctionId],
        queryFn: () => fetchPlayers(auctionId, firebaseToken!),
        enabled: !!firebaseToken && !!auctionId,
    });
}

// --- FETCH CATEGORIES ---
const fetchCategories = async (auctionId: string, token: string) => {
    if (!token || !auctionId) return [];
    const res = await fetch(`${API_URL}/category?auctionId=${auctionId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        handleAuthError(res);
        throw new Error("Failed to fetch categories");
    }
    const resData = await res.json();
    return resData.data || [];
};

export function useCategories(auctionId: string) {
    const { firebaseToken } = useAuthStore();
    return useQuery({
        queryKey: ['categories', auctionId],
        queryFn: () => fetchCategories(auctionId, firebaseToken!),
        enabled: !!firebaseToken && !!auctionId,
    });
}
