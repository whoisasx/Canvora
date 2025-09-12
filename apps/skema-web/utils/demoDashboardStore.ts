import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DemoRoom {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
	createdAt: Date;
	description?: string;
	category: "design" | "development" | "marketing" | "personal";
	color: string;
	participants: number;
	lastActivity: Date;
}

export interface DemoUser {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: "admin" | "member" | "viewer";
}

interface DemoDashboardStore {
	// Theme
	theme: "light" | "dark" | "system";
	setTheme: (theme: "light" | "dark" | "system") => void;

	// Sidebar
	sidebarOpen: boolean;
	toggleSidebar: () => void;
	setSidebarOpen: (open: boolean) => void;

	// Rooms
	rooms: DemoRoom[];
	setRooms: (rooms: DemoRoom[]) => void;
	addRoom: (room: DemoRoom) => void;
	updateRoom: (id: string, updates: Partial<DemoRoom>) => void;
	deleteRoom: (id: string) => void;

	// Filters
	selectedFilter: "all" | "recent" | "favorites" | "trash";
	setSelectedFilter: (
		filter: "all" | "recent" | "favorites" | "trash"
	) => void;

	// Search
	searchQuery: string;
	setSearchQuery: (query: string) => void;

	// View mode
	viewMode: "grid" | "list";
	setViewMode: (mode: "grid" | "list") => void;

	// Create modal
	createModalOpen: boolean;
	setCreateModalOpen: (open: boolean) => void;

	// Notifications
	notifications: Array<{
		id: string;
		title: string;
		message: string;
		type: "info" | "success" | "warning" | "error";
		read: boolean;
		createdAt: Date;
	}>;
	addNotification: (
		notification: Omit<
			DemoDashboardStore["notifications"][0],
			"id" | "createdAt"
		>
	) => void;
	markNotificationAsRead: (id: string) => void;
	clearAllNotifications: () => void;
}

export const useDemoDashboardStore = create<DemoDashboardStore>()(
	persist(
		(set, get) => ({
			// Theme
			theme: "system",
			setTheme: (theme) => set({ theme }),

			// Sidebar
			sidebarOpen: true,
			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),
			setSidebarOpen: (open) => set({ sidebarOpen: open }),

			// Rooms
			rooms: [],
			setRooms: (rooms) => set({ rooms }),
			addRoom: (room) =>
				set((state) => ({ rooms: [...state.rooms, room] })),
			updateRoom: (id, updates) =>
				set((state) => ({
					rooms: state.rooms.map((room) =>
						room.id === id ? { ...room, ...updates } : room
					),
				})),
			deleteRoom: (id) =>
				set((state) => ({
					rooms: state.rooms.filter((room) => room.id !== id),
				})),

			// Filters
			selectedFilter: "all",
			setSelectedFilter: (filter) => set({ selectedFilter: filter }),

			// Search
			searchQuery: "",
			setSearchQuery: (query) => set({ searchQuery: query }),

			// View mode
			viewMode: "grid",
			setViewMode: (mode) => set({ viewMode: mode }),

			// Create modal
			createModalOpen: false,
			setCreateModalOpen: (open) => set({ createModalOpen: open }),

			// Notifications
			notifications: [],
			addNotification: (notification) =>
				set((state) => ({
					notifications: [
						{
							...notification,
							id: Math.random().toString(36).slice(2, 11),
							createdAt: new Date(),
						},
						...state.notifications,
					],
				})),
			markNotificationAsRead: (id) =>
				set((state) => ({
					notifications: state.notifications.map((notification) =>
						notification.id === id
							? { ...notification, read: true }
							: notification
					),
				})),
			clearAllNotifications: () => set({ notifications: [] }),
		}),
		{
			name: "dashboard-storage",
			partialize: (state) => ({
				theme: state.theme,
				sidebarOpen: state.sidebarOpen,
				viewMode: state.viewMode,
				selectedFilter: state.selectedFilter,
				notifications: state.notifications,
			}),
		}
	)
);
