import { Message } from "../draw";

export class LayerManager {
	private messages: Message[];

	constructor(messages: Message[]) {
		this.messages = messages;
	}
	getMessages() {
		return this.messages;
	}
	setMessages(messages: Message[]) {
		this.messages = messages;
	}
	bringtoFront(message: Message) {
		this.messages = this.messages.filter((m) => m.id !== message.id);
		this.messages.push(message);
	}
	bringtoBack(message: Message) {
		this.messages = this.messages.filter((m) => m.id !== message.id);
		this.messages.unshift(message);
	}
	bringForward(msg: Message) {
		const i = this.messages.findIndex((m) => m.id === msg.id);
		if (i === -1 || i === this.messages.length - 1) return;

		const temp = this.messages[i];
		this.messages[i] = this.messages[i + 1]!;
		this.messages[i + 1] = temp!;
	}
	sendBackward(msg: Message) {
		const i = this.messages.findIndex((m) => m.id === msg.id);
		if (i <= 0) return;

		const temp = this.messages[i];
		this.messages[i] = this.messages[i - 1]!;
		this.messages[i - 1] = temp!;
	}
}
