import { definePlugin } from "@expressive-code/core";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

export function pluginAccordionCode() {
  return definePlugin({
    name: "Accordion Code",
    hooks: {
      // Add hooks to perform actions during the plugin's lifecycle
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const { title = "my-code.ext" } = codeBlock.props;

        const codeDOM = toHtml(renderData.blockAst);
        const accordionDOM = getAccordionDOM(title, codeDOM);
        const firstChild = fromHtml(accordionDOM).children[0];
        renderData.blockAst = firstChild as any;
      },
    },
  });
}

function getAccordionDOM(title: string, bodyDOM: string) {
  return `
  <button class="accordion">
    <h3>${title}</h3>
  </button>
  <div class="panel">
    ${bodyDOM}
  </div>`;
}
