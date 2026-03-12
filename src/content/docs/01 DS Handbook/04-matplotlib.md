---
title: Matplotlib
---

![Matplotlib Image](./04-matplotlib.drawio.svg)

```py title='general matplotlib tips'
# ====== PLOTTING FROM AN IPYTHON NOTEBOOK
# `%matplotlib notebook`: interactive plots embedded within the notebook
# `%matplotlib inline`: static images of your plot embedded in the notebook (USE THIS)

import matplotlib as mpl
import matplotlib.pyplot as plt # most often used than 'mpl' module
plt.style.use('classic') # use plt.style directive to choose styles for the figures
# plt.style.available[:5]
# Some good style: fivethirtyeight, ggplot, bmh
# to use seaborn style: import seaborn as sns; sns.set_theme()

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

```py title='lines'
x = np.linspace(0, 10, 1000)
# ==== MULTIPLE LINES
y = np.sin(x[:, np.newaxis] + np.pi * np.arange(0, 2, 0.5)) # shape: (1000, 4)
lines = plt.plot(x, y) # creates and returns a list of created line instances (4)
```

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
    linewidth=4, # or lw=4
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

```py title='legends'
# ==== CUSTOMIZATION
ax.legend(
    loc="upper center",
    ncol=2,  # number of column
    frameon=True,  # turn on the frame
    fancybox=True,  # rounded box
    shadow=True,  # add a shadow
    scatterpoints=1,  # number of points in the legend for SCATTER PLOT
)

# ==== CHOOSING ELEMENTS FOR THE LEGENDS
# lines is a list of plt.Line2D instances
plt.legend(lines[:2], ['first', 'second']) # map line & label

# ==== ALTERNATIVE METHOD FOR CHOOSING ELEMENTS
plt.plot(x, y[:, 0], label='first')
plt.plot(x, y[:, 1], label='second')
plt.plot(x, y[:, 2:]) # by default, the legend ignores all elements without a label attribute
plt.legend()

# ==== EXAMPLE: SCATTER PLOT
# Here we are creating FAKE scatter point with labels so that it can be shown in legend
# The legend will always reference some object that is on the plot, so if we’d like to display a particular shape we need to plot it
# we'll plot empty lists with the desired size and label
for area in [100, 300, 500]:
    plt.scatter([], [], c='k', alpha=0.3, s=area, label=str(area) + ' km$^2$')
plt.legend(scatterpoints=1, frameon=False, labelspacing=1, title='City Area')

# ==== MULTIPLE LEGENDS
# specify the lines and labels of the first legend
ax.legend(lines[:2], ["line A", "line B"], loc="upper right")
# Create the second legend and add the artist manually.
from matplotlib.legend import Legend
leg = Legend(ax, lines[2:], ["line C", "line D"], loc="lower right") # create a new legend artist from scratch
ax.add_artist(leg)
```

```py title='colorbar'
plt.colorbar(extend="both") # indicate the out-of-bounds values with a triangular arrow at the top and bottom
plt.clim(-1, 1) # limit
plt.*(...,cmap=plt.cm.get_cmap("Blues", 6)) # discrete colorbars (6 values) instead of continuous
```

## Multiple subplots

```py title='plt.axes: subplots by hand'
ax1 = plt.axes()  # standard axes
ax2 = plt.axes([0.65, 0.65, 0.2, 0.2]) # [left, bottom, width, height]

# ==== add_axes()
fig = plt.figure()
ax1 = fig.add_axes([0.1, 0.5, 0.8, 0.4], xticklabels=[], ylim=(-1.2, 1.2))
ax2 = fig.add_axes([0.1, 0.1, 0.8, 0.4], ylim=(-1.2, 1.2))
```

```py title='plt.subplot: grid of subplots'
fig = plt.figure()
fig.subplots_adjust(hspace=0.4, wspace=0.4) # height & width spacing is 40% of the subplot height & width, respectively
for i in range(1, 7):
    plt.subplot(2, 3, i) # (row,col, index_of_plot). Runs from upper left to bottom right
    plt.text(0.5, 0.5, str((2, 3, i)), fontsize=18, ha="center")
```

```py title='plt.subplots: whole grid in one go'
# `subplots` with 's'
fig, ax = plt.subplots(2, 3, sharex="col", sharey="row")
ax.shape  # (2, 3). 2 rows, 3 columns
# sharex="col" or sharex=True: same column share their x-axis scale
# sharey="row" or sharey=True: same row share their y-axis scale
```

```py title='plt.GridSpec: more complicated arrangements'
# plt.GridSpec() does not create a plot by itself; it is a interface that is recognized by the plt.subplot()
# similarly plt.subplot(), runs from upper left to bottom right
grid = plt.GridSpec(2, 3, wspace=0.4, hspace=0.3)
plt.subplot(grid[0, 0])
plt.subplot(grid[0, 1:])
plt.subplot(grid[1, :2])
plt.subplot(grid[1, 2])
```

```py title='plt.GridSpec: multi-axes histogram example'
fig = plt.figure()
grid = plt.GridSpec(4, 4, hspace=0.2, wspace=0.2)
main_ax = fig.add_subplot(grid[:-1, 1:])
y_hist = fig.add_subplot(grid[:-1, 0], xticklabels=[], sharey=main_ax) # share y-axis with main_ax
x_hist = fig.add_subplot(grid[-1, 1:], yticklabels=[], sharex=main_ax) # share x-axis with main_ax
# scatter points on the main axes
main_ax.plot(x, y, "ok", markersize=3, alpha=0.2)
# histogram on the attached axes
x_hist.hist(x, 40, histtype="stepfilled", orientation="vertical", color="gray")
x_hist.invert_yaxis() # invert y-axis
y_hist.hist(y, 40, histtype="stepfilled", orientation="horizontal", color="gray")
y_hist.invert_xaxis()
```

## Text & Annotation

```py title='Basic'
style = dict(size=10, color="gray", ha="center")  # ha: horizonal alignment
plt.text(2, 0, "Thanksgiving", **style)  # (x, y, text, **kwargs)
```

```py title='Transforms & Text Position'
fig, ax = plt.subplots(facecolor="lightgray")
ax.axis([0, 10, 0, 10])
ax.text(1, 5, ". Data: (1, 5)", transform=ax.transData)  # default. Transform associated with data coordinates
ax.text(0.5, 0.1, ". Axes: (0.5, 0.1)", transform=ax.transAxes) # Transform associated with the axes (in units of axes dimensions)
ax.text(0.2, 0.2, ". Figure: (0.2, 0.2)", transform=fig.transFigure) # Transform associated with the figure (in units of figure dimensions)
# if we change the axes limits, it is only the transData coordinates that will be affected, while the others remain stationary
```

```py title='Arrows & Annotation'
# plt.annotate(): creates text + an arrow.The arrow can be very flexibly specified
ax.annotate(
    "local maximum",
    xy=(6.28, 1), # point to which the annotation points
    xytext=(10, 4), # text position
    arrowprops=dict(facecolor="black", shrink=0.05), # arrow style is controlled through the arrowprops dict
)
ax.annotate(
    "local minimum",
    xy=(5 * np.pi, -1),
    xytext=(2, -6),
    arrowprops=dict(arrowstyle="->", connectionstyle="angle3,angleA=0,angleB=-90"),
)
```

## Customizing Ticks

```py title='Major & Minor Ticks'
# major ticks are usually bigger or more pronounced, while minor ticks are usually smaller
# We can customize tick properties by setting the formatter and locator objects of each axis
ax.yaxis.set_major_locator(plt.NullLocator())  # removes the ticks (and thus the labels as well)
ax.xaxis.set_major_formatter(plt.NullFormatter())  # removes the labels (but kept the ticks/gridlines)
```

```py title='tick format'
def format_func(value, tick_number):
    # value is the tick value, tick_number is the index of the tick
    return "some-text"
ax.xaxis.set_major_formatter(plt.FuncFormatter(format_func))
```

| locator                        | expain                                                     |
| ------------------------------ | ---------------------------------------------------------- |
| `plt.NullLocator()`            | removes the ticks (and thus the labels as well)            |
| `plt.MaxNLocator(3)`           | specify the maximum number of ticks that will be displayed |
| `plt.MultipleLocator(np.pi/4)` | locates ticks at a multiple of the number you provide      |

## Geographic Data with Basemap

![basemap](./04-matplotlib-basemap.drawio.svg)

```py title='install & import'
!pip install basemap

from mpl_toolkits.basemap import Basemap # one of the toolkit that lives under `mpl_toolkits` namespace
```

```py title='basic: plot on map image'
fig = plt.figure(figsize=(8, 8))
m = Basemap(
    projection="lcc", # how to project 3D image on 2D surface
    resolution=None, # 'c' (crude), 'l' (low), 'i' (intermediate), 'h' (high), 'f' (full), or None if no boundaries will be used
    # AREA #1
    width=8e6,  # width of the map in km
    height=8e6,  # height of the map in km
    lat_0=45,  # central latitude
    lon_0=-100,  # central longitude
    # OR AREA #2
    llcrnrlat=-90, # lower-left corner latitude
    llcrnrlon=-180, # lower-left corner longitude
    urcrnrlat=90, # upper-right corner latitude
    urcrnrlon=180, # upper-right corner longitude
)
# draw image
m.etopo(scale=0.5, alpha=0.5)  # scale: allows to downsample (reduce resolution) the image

# latitude(parallel) and longitude(meridian) lines
m.drawparallels(np.arange(-90, 90, 30), labels=[1, 0, 0, 0])  # labels: [left, right, top, bottom]
m.drawmeridians(np.arange(-180, 180, 60), labels=[0, 0, 0, 1])

# Map (long, lat) to (x, y) for plotting
x, y = m(-122.3, 47.6)
plt.plot(x, y, "ok", markersize=5)
plt.text(x, y, " Seattle", fontsize=12)

# plotting with lat/lon, rather than x/y
# Basemap instance has Matplotlib plot counterparts, but have an additional Boolean argument `latlon`,
# which if set to True allows you to pass raw latitudes and longitudes, rather than projected (x, y) coordinates
m.scatter(lon, lat, latlon=True, ...)
```

| type of projection | example              | define                                                                                              |
| ------------------ | -------------------- | --------------------------------------------------------------------------------------------------- |
| Cylindrical        | `projection='cyl'`   | lines of latitude and longitude are mapped to horizontal and vertical lines. Map shape is Rectangle |
| Pseudo-cylindrical | `projection='moll'`  | laditudes are horizontal, and longitudes are elliptical arc. Map shape is Oval                      |
| Perspective        | `projection='ortho'` | similar to if you photographed the Earth from a particular point in space. Map shape is Circle      |
| Conic              | `projection='lcc'`   | projects the map onto a single cone, which is then unrolled                                         |

| draw a map background                   | syntax             | define                                                                           |
| --------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| Physical boundaries and bodies of water | `drawcoastlines()` | Draw continental coast lines                                                     |
|                                         | `drawrivers()`     | Draw rivers on the map                                                           |
|                                         | `fillcontinents()` | Fill the continents with a given color; optionally fill lakes with another color |
| Political boundaries                    | `drawcountries()`  | Draw country boundaries                                                          |
| Map features                            | `drawparallels()`  | Draw lines of constant latitude                                                  |
|                                         | `drawmeridians()`  | Draw lines of constant longitude                                                 |
| Whole-globe images                      | `bluemarble()`     | Project NASA’s blue marble image onto the map                                    |
|                                         | `shadedrelief()`   | Project a shaded relief image onto the map                                       |
|                                         | `etopo()`          | Draw an etopo relief image onto the map                                          |

## Visualization with Seaborn

| plot                                                | define                                                                      |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| `sns.kdeplot(data[col], fill=True)`                 | Kernel density estimates for visualizing distributions                      |
| `sns.distplot(data['x'])`                           | Kernel density and histograms plotted together                              |
| `sns.jointplot(data, x="x", y="y", kind="kde")`     | Joint distribution plot with a 2D kernel density estimate                   |
| `sns.jointplot(data, x="x", y="y", kind="hex")`     | Joint distribution plot with a hexagonal bin representation                 |
| `sns.pairplot(iris, vars=<col-list> hue="species")` | Pair plot showing the relationships between multiple variables              |
| Faceted histograms                                  | Histograms of subsets                                                       |
| Categorical plot                                    | Used for drawing a wide variety of plots that involve categorical variables |
| `sns.lmplot(x="total_bill", y="tip", data=tips)`    | plots scatter data and draws a Linear regression Model fit (LM)             |

```py title='Example: Faceted histograms'
tips = sns.load_dataset('tips')
tips["tip_pct"] = 100 * tips["tip"] / tips["total_bill"]
grid = sns.FacetGrid(tips, row="sex", col="time", margin_titles=True)
grid.map(plt.hist, "tip_pct", bins=np.linspace(0, 40, 15))
```

```py title='Example: Categorical Plot: Distribution Box'
tips = sns.load_dataset("tips")
g = sns.catplot(tips, x="day", y="total_bill", hue="sex", kind="box")
g.set_axis_labels("Day", "Total Bill") # OR plt.xlabel("Day"); plt.ylabel("Total Bill")
```

```py title="Example:Categorical Plot: Bar Plots"
planets = sns.load_dataset("planets")
# ==== histogram as a special case
g = sns.catplot(planets, x="year", aspect=2, kind="count", color="steelblue") # aspect: ratio of width to height of the figure
g.set_xticklabels(step=5)
# ==== Number of planets discovered by year and method
g = sns.catplot(planets, x="year", aspect=4.0, kind="count", hue="method", order=range(2001, 2015)) # order: sets the limit as well
g.set_ylabels("Number of Planets Discovered")
```

## Misc

| matplotlib syntax                                                               | explain                               |
| ------------------------------------------------------------------------------- | ------------------------------------- |
| `plt.grid(visible=True, which="major", axis="both", linestyle="--", alpha=0.5)` | grid lines                            |
| `plt.axes(xscale="log", yscale="log")`                                          | scale: can be linear scale, log scale |
| `plt.axvline(4, color="red", linestyle="--")`                                   | axis Vertical Line                    |
| `plt.subplots(...subplot_kw={...}, gridspec_kw=dict(...))`                      | `_kw` stands for keyword arguments    |

| seaborn syntax                                         | explain                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `g.map(plt.axvline, x=0, color="red", linestyle="--")` | Apply a plotting function to each facet's subset of the data |
