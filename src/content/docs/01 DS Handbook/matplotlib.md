---
title: Matplotlib
---

![Matplotlib Image](./matplotlib.drawio.svg)

```py title='general matplotlib tips'
# ====== PLOTTING FROM AN IPYTHON NOTEBOOK
# `%matplotlib notebook`: interactive plots embedded within the notebook
# `%matplotlib inline`: static images of your plot embedded in the notebook (USE THIS)

import matplotlib as mpl
import matplotlib.pyplot as plt # most often used than 'mpl' module
plt.style.use('classic') # use plt.style directive to choose styles for the figures

plt.show() # needed in .py file and NOT in .ipynb
```

## Types of plot

| plot type | no. of dimension | syntax                | when to use                             |
| --------- | ---------------- | --------------------- | --------------------------------------- |
| line      | 2                | `.plot(x, np.sin(x))` | Plot y versus x as lines and/or markers |

## Adjusting plot

```py title='Line colors & styles'
# color: use name, or RGB hex code, or short color code(rgbcmyk(Red/Green/Blue/Cyan/Magenta/Yellow/blacK))
plt.plot(x, np.sin(x - 1), color="pink")
# linestyle: use name or code -> solid(-), dashed(--), dashdot(-.), dotted(:)
plt.plot(x, np.sin(x - 2), linestyle="-.")
# short hand for color and linestyle
plt.plot(x, np.sin(x - 3), ":k")
```

```py title='axes limits'
plt.xlim(-1, 11)  # set the x-limit to left, right
plt.ylim(-1.5, 1.5)  # set the y-limit to bottom, top
# reverse the order of the arguments to display axis in reverse

# OR use plt.axis() - NOTE AXIS WITH I. DO NOT CONFUSE WITH `AXES`
plt.axis([-1, 11, -1.5, 1.5]) # set the x and y limits with a single call. [xmin, xmax, ymin, ymax]
plt.axis('tight') # tighten the bounds around the current plot
plt.axis("equal") # ensuring equal aspect ratio such that one unit in x is equal to one unit in y
```

```py title='labelling plots'
plt.plot(x, np.sin(x), "-g", label="sin(x)")  # `label` is used for legend
plt.plot(x, np.cos(x), ":b", label="cos(x)")
plt.title("A Sine Curve")  # Title of plot
plt.xlabel("x")  # Label for x-axis
plt.ylabel("sin(x)")
plt.legend()
```
