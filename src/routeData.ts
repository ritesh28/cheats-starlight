import {
  defineRouteMiddleware,
  type StarlightRouteData,
} from "@astrojs/starlight/route-data";
import { parse, type DefaultTreeAdapterTypes } from "parse5";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

type TocItem = NonNullable<StarlightRouteData["toc"]>["items"][number];

function createToc(docNode: DefaultTreeAdapterTypes.Document): TocItem[] {
  const tocList: TocItem[] = [
    {
      depth: 2,
      slug: "_top",
      text: "Overview",
      children: [],
    },
  ];
  // location of last inserted toc item
  const itemLocation: number[] = [0];

  const list: DefaultTreeAdapterTypes.Node[] = [docNode];
  while (list.length) {
    const node = list.pop();
    if (!node) continue;

    if (!("childNodes" in node)) continue;
    // DFS
    list.push(...node.childNodes.slice().reverse());

    if (!("attrs" in node)) continue;
    const idAttribute = node.attrs.find((attr) => attr.name === "id");
    if (!idAttribute) continue;

    // if 'p', 'div', or other than h1-h6, set depth to 4
    const headingNumber = parseInt(node.tagName.substring(1), 10);
    const depth = Number.isNaN(headingNumber) ? 4 : headingNumber;

    const slug = slugify(idAttribute.value);
    const text = node.childNodes
      .reduce((acc, child) => {
        if (child.nodeName === "#text") {
          return (
            acc + (child as unknown as DefaultTreeAdapterTypes.TextNode).value
          );
        }
        return acc;
      }, "")
      .replace(/\n+/g, "")
      .trim();
    while (true) {
      // get last toc item
      let tocItem: TocItem = tocList[itemLocation[0]];
      for (let i = 1; i < itemLocation.length; i++) {
        tocItem = tocItem.children[itemLocation[i]];
      }

      if (tocItem.depth < depth) {
        // add child
        tocItem.children.push({ depth, slug, text, children: [] });
        itemLocation.push(tocItem.children.length - 1);
        break;
      }
      if (itemLocation.length === 1) {
        // if tocItem is root, then add new item
        tocList.push({ depth, slug, text, children: [] });
        itemLocation[0] = tocList.length - 1;
        break;
      }
      // go up
      itemLocation.pop();
    }
  }
  return tocList;
}

export const onRequest = defineRouteMiddleware((context) => {
  const html = context.locals.starlightRoute.entry.rendered?.html;

  if (!html) {
    return;
  }

  const { toc } = context.locals.starlightRoute;
  if (toc) {
    const ast = parse(html);
    const my_toc = createToc(ast);
    toc.items = my_toc;
  }
});
