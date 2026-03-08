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

| plot type         | no. of dimension     | syntax                                 | when to use                                                                          |
| ----------------- | -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| line              | 2 (x,y)              | `.plot()`                              | Plot y versus x as lines and/or markers                                              |
| scatter           | 4 (x,y,color,size)   | `.scatter()`                           | when you want to control each point props (size,face color, edge color) individually |
| error             | 1 (d(delta/)y or dx) | `.errorbar()`,`fill_between()`         | display error                                                                        |
| density & contour | 3 (x,y,z)            | `.contour()`,`.contourf()`,`.imshow()` | display 3D data in 2D using contours or color-coded regions                          |
| histogram         | 1 (x) or 2(x,y)      | `.hist()`, `.hist2d()`, `.hexbin()`    | shows distribution of data                                                           |

```py title='scatter plot with plt.plot'
plt.plot(x, y, "o", color="c")  # third argument is the marker style
# other markers: ".", ",", "x", "+", "v", "^", "<", ">", "s" (square), "d" (diamond)

# ==== SHORT-HAND
plt.plot(x, y, "-ok") # line (-), circle marker (o), black (k)

# ==== ADDITIONAL KEYWORD ARGUMENTS FOR LINE AND MARKER PROPERTIES
plt.plot(
    x,
    y,
    "-p",  # pentagon marker with a line
    color="gray",
    linewidth=4,
    markersize=15,
    markerfacecolor="white",
    markeredgecolor="gray",
    markeredgewidth=2,
)
```

```py title='scatter plot with plt.scatter'
plt.scatter(x, y, marker="o")

# ==== CHANGING SIZE, COLOR IN SCATTER POINTS
plt.scatter(
    x,
    y,
    c=colors,  # color array-like
    s=sizes,  # size array-like
    alpha=0.3,  # transparency
    cmap="viridis",  # color map
)
plt.colorbar()  # show color scale
```

```py title='visualizing error'
# ==== BASIC ERROR-BARS
plt.errorbar(
    x,
    y,
    yerr=0.8,  # vertical error bar sizes (±0.8)
    fmt=".k",  # format for the appearance of lines and points, and has same syntax as the shorthand used in plt.plot
    ecolor="lightgray",  # error bar line color
    elinewidth=3,  # error bar line width
    capsize=5,  # error bar cap (horizontal line at the end of the error bar) size
)

# ==== CONTINUOUS ERRORS: Combine primitives like plt.plot and plt.fill_between
plt.plot(x, y, "-", color="gray")
plt.fill_between(
    x, y - 0.8, y + 0.8, color="gray", alpha=0.2
)  # we pass x, lower y-bound & upper y-bound. Result is the continuous uncertainty(error) with filled regions
```

```py title='density & contour plot'
# TYPES: plt.contour for contour plots, plt.contourf for filled contour plots, and plt.imshow for showing images
# 3D FUNCTION: z = f(x, y)
def f(x, y):
    return np.sin(x) + np.cos(y)

x, y = np.linspace(-5, 5, 50), np.linspace(-5, 5, 40)
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# ==== CONTOUR PLOTS: VISUALIZING THREE-DIMENSIONAL DATA WITH CONTOURS
# plt.contour() takes three arguments: a grid of x values, a grid of y values, and a grid of z values.
# The x and y values represent positions on the plot, and the z values will be represented by the contour levels

# SINGLE COLOR: -ve Z values are represented by dashed lines, and +ve Z values by solid lines
plt.contour(X, Y, Z, colors="black")

# MULTI COLOR
plt.contour(
    X,
    Y,
    Z,
    20,  # 20 contour levels
    cmap="RdGy",  # colormap to color the lines according to their z value
)
plt.colorbar()  # shows the mapping between colors and z values

# ==== FILLED CONTOUR PLOTS
plt.contourf(X, Y, Z, 20, cmap="RdGy")  # uses largely the same syntax as plt.contour()
plt.colorbar()

# ==== IMAGES
# problem of filled contour: the color steps are discrete rather than continuous, which is not always what is desired
# solution: use plt.imshow() which interprets a 2D grid of data as an image
plt.imshow(
    Z,
    extent=[-5, 5, -5, 5],  # doesn’t accept x & y grid, so set [xmin,xmax,ymin,ymax]
    origin="lower",  # by default, origin is in the upper left (like all images), not in the lower left as in most contour plots
    cmap="RdGy",
)
plt.colorbar()
plt.axis("image")  # make sure the plot is square

# ==== CONTOUR + IMAGE: LABELED CONTOURS ON TOP OF AN IMAGE
contours = plt.contour(X, Y, Z, colors="black")
plt.clabel(contours, inline=True, fontsize=8)  # label on contours
plt.imshow(Z, extent=[-5, 5, -5, 5], origin="lower", cmap="RdGy", alpha=0.5)
plt.colorbar()
```

```py title='histogram'
data = np.array([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])
plt.hist(
    data,
    bins=4,
    alpha=0.5,
    histtype="stepfilled",  # "stepfilled" for filled histogram, "step" for unfilled histogram
    color="steelblue",
    edgecolor="none",  # No edge color
)
```

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
