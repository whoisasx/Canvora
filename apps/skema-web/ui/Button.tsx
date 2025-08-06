import { ReactNode } from "react";

interface IButton {
	children: ReactNode;
	className?: string;
	size: string;
	level: string;
	onClick: (e: React.PointerEventHandler<HTMLButtonElement>) => void;
}

const sizeProps = {
	small: "",
	medium: "",
	large: "",
};
const levelProps = {
	primary: "",
	secondary: "",
	tertiary: "",
};

export const Button = ({
	children,
	className,
	size,
	level,
	onClick,
}: IButton) => {
	return (
		<button className="" style={{}} onClick={() => console.log("hi")}>
			hi
		</button>
	);
};
