import { definePlugin } from "@expressive-code/core";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

export function pluginAccordionCode() {
  return definePlugin({
    name: "Accordion Code",
    hooks: {
      // Add hooks to perform actions during the plugin's lifecycle
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const title = codeBlock.props.title as string; // default title is set in astro.config.ts [expressiveCode]

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
  <div class="accordion active">
    <h3 class="inline text-lg dark:text-white">${title}</h3>
  </div>
  <div class="panel">
    ${bodyDOM}
  </div>`;
}
