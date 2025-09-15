import { WebSocket } from "ws";

export type messageType =
	| "join-room"
	| "leave-room"
	| "draw-message"
	| "create-message"
	| "delete-message"
	| "update-message"
	| "cursor"
	| "sync-all"
	| "undo"
	| "redo"
	| "reset-canvas";

export interface MessageData {
	type: string;
	roomId?: string;
	clientId?: string;
	message?: any;
	id?: string;
	newMessage?: any;
	flag?: string;
	username?: string;
	pos?: { x: number; y: number };
	messages?: any[];
	previewId?: string;
}

export interface User {
	username: string;
	userId: string;
	ws: WebSocket;
	rooms: string[];
}

export interface JwtPayload {
	id: string;
	username: string;
	email?: string;
	iat?: number;
	exp?: number;
}

export type Op =
	| { type: "create"; userId: string; message: any }
	| { type: "delete"; userId: string; message: any }
	| {
			type: "update";
			userId: string;
			id: string;
			prevMessage: any;
			newMessage: any;
	  };

export type OpWithIndex = Op & { index?: number };

export interface ServerConfig {
	port: number;
	jwtSecret: string;
	baseUrl: string;
	drawThrottleMs: number;
	maxHistorySize: number;
	roomCleanupInterval: number;
}

// Validation functions
export function validateMessage(data: any): data is MessageData {
	return data && typeof data.type === "string";
}

export function validateRoomId(roomId: any): roomId is string {
	return typeof roomId === "string" && roomId.length > 0;
}

export function validateUserId(userId: any): userId is string {
	return typeof userId === "string" && userId.length > 0;
}

export interface JoinRoom {}
