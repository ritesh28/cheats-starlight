---
title: Example Guide
description: A guide in my new Starlight docs site.
tableOfContents:
  minHeadingLevel: 1
  maxHeadingLevel: 5
---

## NOT USING

### Collapsible

<details>
<summary>

**Click Me**

</summary>
Some collapsible content
</details>

### Definition Lists

<dl>
<dt>List: Title</dt>
<dd>Definition #1</dd>
<dd>Definition #2</dd>
</dl>

### Task Lists

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

### Highlight

I need to highlight these <mark>very important words</mark>

## USING

### Table

| Header 1 | Header 2 |
| -------- | -------- |
| Row 1    | Row 1    |
| Row 2    | Row 2    |

### Code

```js {1-2} "true" title="my-code.js" wrap
var fun = function lang(l) {
  dateformat.i18n = require("./lang/" + l);
  return true;
};
```

### Typography

**Bold**

### Link

[title](#heading-click-me)

### Image

![alt text](https://media.istockphoto.com/id/865443476/photo/man-holding-surreal-painting-of-a-boardwalk.jpg?s=612x612&w=0&k=20&c=6D0HD5a6odjGz6-40RdOd26T3i-UweZ5fl6us2boTbs=)

## My Convention

---

h2 - overview (provided by the starlight.astro)

**term**: single definition

**term**

- multi-line definition #1
- multi-line definition #2

h2 - custom heading followed by:

- aside
- table
- list
- code

aside:

- :::tip[When to use?]
- :::tip[Why to use?]

code:

- title="usage-steps.py"
- title="\*-example.py"
