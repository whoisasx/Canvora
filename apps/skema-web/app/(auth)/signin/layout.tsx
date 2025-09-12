import { ThemeWrapper } from "@/components/ThemeWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <ThemeWrapper>{children}</ThemeWrapper>;
}
