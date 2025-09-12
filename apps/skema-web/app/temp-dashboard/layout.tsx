import { ThemeWrapper } from "@/components/ThemeWrapper";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeWrapper>{children}</ThemeWrapper>
		</SessionProvider>
	);
}
