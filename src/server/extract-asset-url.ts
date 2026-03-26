function extractMarkdownUrl(content: string) {
  const markdownMatch = content.match(/\((https?:\/\/[^\s)]+)\)/i);
  if (markdownMatch) {
    return markdownMatch[1];
  }

  return null;
}

function extractHtmlUrl(content: string) {
  const htmlMatch = content.match(/(?:src|href)=["'](https?:\/\/[^"']+)["']/i);
  if (htmlMatch) {
    return htmlMatch[1];
  }

  return null;
}

function extractPlainUrl(content: string) {
  const plainMatch = content.match(/https?:\/\/\S+/i);
  if (plainMatch) {
    return plainMatch[0].replace(/[)>.,]+$/, "");
  }

  return null;
}

export function extractAssetUrl(content: string | null | undefined) {
  if (!content) {
    return "";
  }

  return extractHtmlUrl(content) ?? extractMarkdownUrl(content) ?? extractPlainUrl(content) ?? "";
}
