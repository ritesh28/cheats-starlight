import type * as H from "hast";
import { visit } from "unist-util-visit";

export default function rehypeImageZoom() {
  return (tree: H.Root) => {
    visit(tree, "element", (node, _index, _parent) => {
      if (node.tagName === "img") {
        node.properties = node.properties || {};
        node.properties.class = (node.properties.class || "") + " zoomable-img";
      }
    });
  };
}
