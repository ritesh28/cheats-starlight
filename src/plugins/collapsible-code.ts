import { definePlugin } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";

export function pluginCollapsibleCode() {
  return definePlugin({
    // The only required property is `name`
    name: "Collapsible Code",
    // Add more properties of `ExpressiveCodePlugin` to make your plugin
    // actually do something (e.g. `baseStyles`, `hooks`, etc.)
    hooks: {
      // Add hooks to perform actions during the plugin's lifecycle
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const { title } = codeBlock.props;
        const id = title?.substring(0, title.indexOf("."));
        renderData.blockAst = h("details", { open: true }, [
          h(`summary#${id}.my-code`, title),
          // Render the original code block
          renderData.blockAst,
        ]);
      },
    },
  });
}
