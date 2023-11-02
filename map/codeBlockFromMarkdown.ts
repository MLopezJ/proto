import type { RootContent } from 'mdast'
import { remark } from 'remark'

export const parseMarkdown2 = remark()

const isCodeBlock =
	(lang: string) =>
	(child: RootContent): boolean =>
		child.type === 'code' && child.lang === lang

const isHeading =
	(title: string) =>
	(child: RootContent): boolean =>
		child.type === 'heading' &&
		child.children[0]?.type === 'text' &&
		child.children[0].value === title

const codeBlockWithHeading =
	(children: RootContent[]) =>
	(lang: string, title: string): string => {
		const block = children.find((child, index, array) => {
			if (!isCodeBlock(lang)(child)) return false
			const prevChild = array[index - 1]
			if (prevChild === undefined) return false
			return isHeading(title)(prevChild)
		}) as { value: string } | undefined
		if (block === undefined)
			throw new Error(`Could not find ${lang} codeblock with title "${title}"!`)
		return block.value
	}

export const codeBlockFromMarkdown = (
	markdown: string,
): ((lang: string, title: string) => string) =>
	codeBlockWithHeading(remark().parse(markdown).children)
