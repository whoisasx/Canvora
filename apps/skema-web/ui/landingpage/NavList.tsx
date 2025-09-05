import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export const NavList = ({
	children,
	href,
	className,
}: {
	children: ReactNode;
	href: string;
	className?: string;
}) => {
	const router = useRouter();
	return (
		<li
			className={`group ${className} w-full h-10  border-transparent hover:bg-canvora-50 hover:border-oc-gray-6 border-t-[0.5px] border-x-[1px] border-b-[2px] text-xs rounded-2xl transition-all duration-300 ease-in-out`}
		>
			<Link
				href={href}
				onClick={(e) => {
					if (window.location.pathname === href) {
						e.preventDefault(); // prevent default navigation
						router.refresh(); // force refresh
					}
				}}
				className="w-full h-full px-3 flex items-center justify-center group-hover:cursor-pointer"
			>
				{children}
			</Link>
		</li>
	);
};
