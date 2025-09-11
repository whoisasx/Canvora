/**
 * Simple IndexedDB-based local persistence for local-only boards.
 * Keeps API small and independent (no external deps).
 */
import { v4 as uuidv4 } from "uuid";

export type LocalMessage = any;

export type LocalSnapshot = {
	id: string;
	version: number;
	messages: LocalMessage[];
	layers?: any;
	meta?: {
		title?: string;
		createdAt: string;
		modifiedAt: string;
		exportedFromVersion?: string;
	};
};

const DB_NAME = "skema-local-db";
const STORE = "boards";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE, { keyPath: "id" });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function withStore<T>(
	mode: IDBTransactionMode,
	fn: (store: IDBObjectStore) => Promise<T>
): Promise<T> {
	const db = await openDB();
	return new Promise<T>((resolve, reject) => {
		const tx = db.transaction(STORE, mode);
		const store = tx.objectStore(STORE);
		fn(store)
			.then((res) => {
				tx.oncomplete = () => resolve(res);
			})
			.catch((err) => reject(err));
		tx.onerror = () => reject(tx.error);
	});
}

export const LocalDriver = {
	async save(id: string, snapshot: LocalSnapshot): Promise<void> {
		if (!id) id = `local:${uuidv4()}`;
		snapshot.id = id;
		snapshot.version = snapshot.version ?? 1;
		snapshot.meta = snapshot.meta ?? {
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString(),
		};
		return withStore("readwrite", (store) => {
			return new Promise<void>((res, rej) => {
				const req = store.put(snapshot);
				req.onsuccess = () => res();
				req.onerror = () => rej(req.error);
			});
		});
	},
	async load(id: string): Promise<LocalSnapshot | null> {
		if (!id) return null;
		return withStore("readonly", (store) => {
			return new Promise<LocalSnapshot | null>((res, rej) => {
				const req = store.get(id);
				req.onsuccess = () => res(req.result ?? null);
				req.onerror = () => rej(req.error);
			});
		});
	},
	async list(): Promise<LocalSnapshot[]> {
		return withStore("readonly", (store) => {
			return new Promise<LocalSnapshot[]>((res, rej) => {
				const req = store.getAll();
				req.onsuccess = () => res(req.result ?? []);
				req.onerror = () => rej(req.error);
			});
		});
	},
	async remove(id: string): Promise<void> {
		return withStore("readwrite", (store) => {
			return new Promise<void>((res, rej) => {
				const req = store.delete(id);
				req.onsuccess = () => res();
				req.onerror = () => rej(req.error);
			});
		});
	},
	exportSnapshot(snapshot: LocalSnapshot) {
		const dataStr = JSON.stringify(snapshot);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `skema-board-${snapshot.id}.json`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	},
	async importFile(file: File): Promise<LocalSnapshot> {
		const text = await file.text();
		const parsed = JSON.parse(text) as LocalSnapshot;
		// minimal validation
		parsed.id = parsed.id ?? `local:${uuidv4()}`;
		parsed.version = parsed.version ?? 1;
		parsed.meta = parsed.meta ?? {
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString(),
		};
		await this.save(parsed.id, parsed);
		return parsed;
	},
};

export default LocalDriver;
