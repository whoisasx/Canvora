export default function Canvas({
	roomId,
	socket,
}: {
	roomId: string;
	socket: WebSocket;
}) {
	return (
		<div>
			<p>hello world</p>
			<canvas></canvas>
		</div>
	);
}
