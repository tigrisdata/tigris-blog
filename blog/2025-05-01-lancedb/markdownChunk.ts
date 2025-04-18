import { encoding_for_model } from "@dqbd/tiktoken";

export type MarkdownSection = {
  heading: string;
  content: string;
};

// Exercise for the reader: handle front matter with the gray-matter package.

export async function chunkify(
  markdown: string,
  maxTokens = 8191,
  model = "text-embedding-3-small"
): Promise<MarkdownSection[]> {
  const encoding = await encoding_for_model(model);
  const sections: MarkdownSection[] = [];

  const lines = markdown.split("\n");
  let currentHeading: string | null = null;
  let currentContent: string[] = [];

  const pushSection = (heading: string, content: string) => {
    const tokens = encoding.encode(content);
    if (tokens.length <= maxTokens) {
      sections.push({ heading, content });
    } else {
      // If section is too long, split by paragraphs
      const paragraphs = content.split(/\n{2,}/);
      let chunkTokens: number[] = [];
      let chunkText: string = "";

      for (const para of paragraphs) {
        const paraTokens = encoding.encode(para + "\n\n");
        if (chunkTokens.length + paraTokens.length > maxTokens) {
          sections.push({
            heading,
            content: chunkText.trim(),
          });
          chunkTokens = [...paraTokens];
          chunkText = para + "\n\n";
        } else {
          chunkTokens.push(...paraTokens);
          chunkText += para + "\n\n";
        }
      }

      if (chunkTokens.length > 0) {
        sections.push({
          heading,
          content: chunkText.trim(),
        });
      }
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6} (.+)/);
    if (headingMatch) {
      if (currentHeading !== null) {
        const sectionText = currentContent.join("\n").trim();
        if (sectionText) {
          pushSection(currentHeading, sectionText);
        }
      }
      currentHeading = headingMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Push the final section
  if (currentHeading !== null) {
    const sectionText = currentContent.join("\n").trim();
    if (sectionText) {
      pushSection(currentHeading, sectionText);
    }
  }

  encoding.free();
  return sections;
}
