import { definePlugin } from "@expressive-code/core";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

export function pluginCollapsibleCode() {
  return definePlugin({
    name: "Collapsible Code",
    hooks: {
      // Add hooks to perform actions during the plugin's lifecycle
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const { title = "my-title" } = codeBlock.props;

        const id = title?.substring(0, title.indexOf(".")) ?? "my-id";

        const codeDOM = toHtml(renderData.blockAst);
        const accordionDOM = getAccordionDOM(id, title, codeDOM);
        const firstChild = fromHtml(accordionDOM).children[0];
        renderData.blockAst = firstChild as any;
      },
    },
  });
}

function getAccordionDOM(id: string, title: string, bodyDOM: string) {
  return `
  <div id="accordion-flush" data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
    <h2 id="accordion-flush-heading-${id}">
      <button type="button" class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-${id}" aria-expanded="true" aria-controls="accordion-flush-body-${id}">
        <span>${title}</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
        </svg>
      </button>
    </h2>
    <div id="accordion-flush-body-${id}" class="hidden" aria-labelledby="accordion-flush-heading-${id}">
      <div class="py-5 border-b border-gray-200 dark:border-gray-700">
        ${bodyDOM}
      </div>
    </div>
  </div>`;
}
