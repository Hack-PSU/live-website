import { Fragment, type ReactNode } from "react";

/*
 * Renders the subset of Discord markdown organizers actually use in
 * announcements. Output is React nodes, never HTML, so message text can't
 * inject markup.
 */

const INLINE =
	/`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|<(https?:\/\/[^\s>]+)>|(https?:\/\/[^\s<]*[^\s<.,:;"')\]!?])|\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\|\|(.+?)\|\||\*([^*\s][^*]*?)\*|\b_([^_\s][^_]*?)_\b/g;

const linkClass = "text-foam underline decoration-slate/60 hover:text-ember";

function inline(text: string): ReactNode[] {
	const out: ReactNode[] = [];
	let last = 0;
	let key = 0;

	for (const m of Array.from(text.matchAll(INLINE))) {
		if (m.index > last) out.push(text.slice(last, m.index));
		last = m.index + m[0].length;
		const k = key++;
		const [, code, label, href, angled, bare, bold, under, strike, spoiler] = m;
		const italic = m[10] ?? m[11];

		if (code !== undefined) {
			out.push(
				<code
					key={k}
					className="rounded bg-ink-deep px-1 font-mono text-[13px]"
				>
					{code}
				</code>
			);
		} else if (label !== undefined) {
			out.push(
				<a
					key={k}
					href={href}
					target="_blank"
					rel="noopener"
					className={linkClass}
				>
					{label}
				</a>
			);
		} else if (angled !== undefined || bare !== undefined) {
			const url = angled ?? bare;
			out.push(
				<a
					key={k}
					href={url}
					target="_blank"
					rel="noopener"
					className={linkClass}
				>
					{url}
				</a>
			);
		} else if (bold !== undefined) {
			out.push(
				<strong key={k} className="text-foam">
					{inline(bold)}
				</strong>
			);
		} else if (under !== undefined) {
			out.push(<u key={k}>{inline(under)}</u>);
		} else if (strike !== undefined) {
			out.push(<s key={k}>{inline(strike)}</s>);
		} else if (spoiler !== undefined) {
			out.push(<Fragment key={k}>{inline(spoiler)}</Fragment>);
		} else if (italic !== undefined) {
			out.push(<em key={k}>{inline(italic)}</em>);
		}
	}

	if (last < text.length) out.push(text.slice(last));
	return out;
}

type Block =
	| { kind: "p" | "heading" | "quote" | "subtext"; lines: string[] }
	| { kind: "list"; lines: string[] };

function blocks(text: string): Block[] {
	const result: Block[] = [];

	for (const line of text.split("\n")) {
		if (!line.trim()) {
			result.push({ kind: "p", lines: [] });
			continue;
		}

		let kind: Block["kind"] = "p";
		let content = line;
		let m: RegExpMatchArray | null;
		if ((m = line.match(/^#{1,3}\s+(.*)$/)))
			[kind, content] = ["heading", m[1]];
		else if ((m = line.match(/^-#\s+(.*)$/)))
			[kind, content] = ["subtext", m[1]];
		else if ((m = line.match(/^>\s?(.*)$/))) [kind, content] = ["quote", m[1]];
		else if ((m = line.match(/^\s*[-*]\s+(.*)$/)))
			[kind, content] = ["list", m[1]];

		const prev = result[result.length - 1];
		if (prev && prev.kind === kind && kind !== "heading" && prev.lines.length) {
			prev.lines.push(content);
		} else {
			result.push({ kind, lines: [content] });
		}
	}

	return result.filter((b) => b.lines.length);
}

function lines(items: string[]): ReactNode[] {
	return items.flatMap((line, i) =>
		i === 0 ? inline(line) : [<br key={`br${i}`} />, ...inline(line)]
	);
}

export default function DiscordText({ text }: { text: string }) {
	return (
		<div className="flex flex-col gap-2">
			{blocks(text).map((block, i) => {
				switch (block.kind) {
					case "heading":
						return (
							<p key={i} className="m-0 font-bold text-foam">
								{inline(block.lines[0])}
							</p>
						);
					case "subtext":
						return (
							<p key={i} className="m-0 text-xs text-slate">
								{lines(block.lines)}
							</p>
						);
					case "quote":
						return (
							<blockquote
								key={i}
								className="m-0 border-l-2 border-line-strong pl-3"
							>
								{lines(block.lines)}
							</blockquote>
						);
					case "list":
						return (
							<ul key={i} className="m-0 list-disc pl-5">
								{block.lines.map((line, j) => (
									<li key={j}>{inline(line)}</li>
								))}
							</ul>
						);
					default:
						return (
							<p key={i} className="m-0">
								{lines(block.lines)}
							</p>
						);
				}
			})}
		</div>
	);
}
