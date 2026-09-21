import { cn } from "@/lib/utils";

interface HexProps {
	/** Width in px; height is derived at the logo's ~1.09 ratio. */
	size?: number;
	color?: string;
	/** Pulse, for anything marked "live". */
	blink?: boolean;
	className?: string;
}

/**
 * The hexagon from the HackPSU logo, used throughout as a bullet, status dot,
 * and map pin. The clip-path itself lives in globals.css as `.hex`.
 */
export default function Hex({
	size = 10,
	color = "#7088B8",
	blink = false,
	className,
}: HexProps) {
	return (
		<span
			aria-hidden
			className={cn(
				"hex block flex-none",
				blink && "animate-hpblink",
				className
			)}
			style={{
				width: size,
				height: Math.round(size * 1.09),
				background: color,
			}}
		/>
	);
}
