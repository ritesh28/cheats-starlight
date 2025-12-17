---
title: Plotly v5.9.0
---

![Plotly intro](./plotly.drawio.svg)

```py title="plotly express"
import plotly.express as px

fig = px.bar(x=["a", "b", "c"], y=[1, 3, 2])
fig.show()
```

```py title="graph objects"
import plotly.graph_objects as go

# .add_trace(): Add a trace to the figure and return a reference to the calling figure
# .add_scatter(): add scatter trace
# .data: A tuple of the figure's trace objects

fig = go.Figure()
fig.add_trace(go.Scatter(y=[2, 3, 1]))
# OR fig.add_scatter(y=[2, 3, 1])
scatter = fig.data[-1]
scatter.marker.size = 30
fig.show()
```

```py title="graph objects #2"
import plotly.graph_objects as go

langs = ["C", "C++", "Java", "Python", "PHP"]
students = [23, 17, 35, 29, 12]
data = [go.Bar(x=langs, y=students)]
fig = go.Figure(data=data)
fig.show()
```

```py title="exporting figure"
import plotly.io as pio

pio.write_html(fig, file="first_figure.html", auto_open=True)
pio.write_image(fig, 'figure.png')
```

## Layout

```py title="legends"
import plotly.graph_objects as go
import numpy as np
import math

xpoints = np.arange(0, math.pi * 2, 0.05)
y1 = np.sin(xpoints)
y2 = np.cos(xpoints)

fig = go.Figure()
fig.add_scatter(x=xpoints, y=y1, name="Sin").add_scatter(x=xpoints, y=y2, name="Cos")
fig.layout = go.Layout(showlegend=True, title="Sin and Cos")
fig.show()
```

```py title="axis and ticks"
fig.layout = go.Layout(
    xaxis=go.layout.XAxis(
        title=go.layout.xaxis.Title(
            text="angle",
            font=go.layout.xaxis.title.Font(family="Arial", size=20, color="green"),
        ),
        showticklabels=True,
        tickfont=go.layout.xaxis.Tickfont(family="Arial", size=18, color="blue"),
        tickmode="linear",
        tick0=0,
        dtick=0.5,
        showgrid=True,
        gridwidth=4,
        zeroline=True,
        showline=True,
        linecolor="black",
    ),
    yaxis=go.layout.YAxis(
        title=go.layout.yaxis.Title(text="value"),
        tickmode="array",
        tickvals=[-1, 0, 1],
        ticktext=["min", "zero", "max"],
        tickangle=45,
    ),
)
```

```py title="multiple axes"
import plotly.graph_objects as go
import numpy as np

# add_scatter(y_axis="..."): Sets a reference between this trace's y coordinates and a 2D cartesian y axis.
# If "y" (the default value), the y coordinates refer to layout.yaxis. If "y2", the y coordinates refer to layout.yaxis2, and so on.
# yaxis2.overlaying='y': `yaxis2` (or `y2`) is overlaid on top of the corresponding `y` axis

x = np.arange(1, 11)
y1 = np.exp(x)
y2 = np.log(x)

fig = go.Figure()
fig.add_scatter(x=x, y=y1, name="exp")
fig.add_scatter(x=x, y=y2, name="log", yaxis="y2")
fig.layout = go.Layout(
    yaxis=go.layout.YAxis(title="exp"),
    yaxis2=go.layout.YAxis(title="log", overlaying="y", side="right"),
)
fig.show()
```

```py title="inset plot"
import plotly.graph_objects as go
import numpy as np

# xaxis2.anchor='y2': `xaxis2` (or `x2`) is bound to the corresponding `y2` axis

x = np.arange(1, 11)
y1 = np.exp(x)
y2 = np.log(x)

fig = go.Figure()
fig.add_scatter(x=x, y=y1, name="exp")
fig.add_scatter(x=x, y=y2, name="log", xaxis="x2", yaxis="y2")
fig.layout = go.Layout(
    xaxis2=go.layout.XAxis(domain=[0.1, 0.5], anchor="y2", showline=True),
    yaxis2=go.layout.YAxis(domain=[0.5, 0.9], anchor="x2", showline=True),
)
fig.show()
```

## Fill Area plot

```py title="Fill Example"
import plotly.graph_objects as go

# fill="tozeroy": fill down to xaxis
# trace1.fill="tonexty": fill to trace0 y. I.e. fill area between trace0 and trace1
# "toself" connects the endpoints of the trace into a closed shape
# "tonext" fills the space between two traces if one completely encloses the other (eg consecutive contour lines), and behaves like "toself" if there is no trace before it
#        # "tonext" should not be used if one trace does not enclose the other.

fig = go.Figure()
fig.add_trace(go.Scatter(x=[1, 2, 3, 4], y=[0, 2, 3, 5], fill="tozeroy"))
fig.add_trace(go.Scatter(x=[1, 2, 3, 4], y=[3, 5, 1, 7], fill="tonexty"))

fig.show()
```

## Subplots

```py title="subplot"
from plotly.subplots import make_subplots

fig = make_subplots(
    rows=2,
    cols=2,
    row_heights=[0.4, 0.6],
    column_widths=[0.6, 0.4],
    start_cell="top-left", # Affects axes arrangement. 'bottom-left' or 'top-left' : default 'top-left'
    specs=[
        [{"colspan": 2, "type": "bar"}, None],
        [{"type": "scatter"}, {"type": "scatter"}],
    ],  # Define colspan
    subplot_titles=("Bar Chart spanning 2 columns", "Subplot 2", "Subplot 3"),
)
fig.print_grid() # Print a visual layout of the figure's axes arrangement
# This is the format of your plot grid:
# [ (1,1) x,y             -      ]
# [ (2,1) x2,y2 ]  [ (2,2) x3,y3 ]
fig.add_bar(
    x=["A", "B", "C", "D"],
    y=[20, 14, 23, 15],
    name="Spanning Bar Trace",
    row=1,
    col=1,  # Target the top-left cell, which is defined to span 2 columns
)
fig.add_scatter(x=[1, 2], y=[1, 2], name="Scatter 1", row=2, col=1)
fig.add_scatter(x=[1, 2], y=[2, 1], name="Scatter 2", row=2, col=2)
fig.update_layout(height=500, width=700, title_text="Subplots with Column Spanning")
fig.show()
```

```py title="shared axes"
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np

# shared_xaxes / shared_yaxes: Set to True, 'all', 'row', or 'col' to link axis properties across subplots.
# shared_yaxes=True: Links all Y-axes in the grid (like shared_yaxes='all').
# shared_yaxes='rows': Links Y-axes for subplots within the same row.
# shared_yaxes='columns': Links Y-axes for subplots within the same column.

N = 20
x = np.linspace(0, 1, N)

fig = make_subplots(1, 3, shared_yaxes="all", shared_xaxes="all")
for i in range(1, 4):
    fig.add_trace(go.Scatter(x=x, y=np.random.random(N)), 1, i)
fig.show()
```

## Hover Text

```py title="Hover mode"
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(y=[10, 34, 23, 45, 12, 34, 23, 44]))
fig.add_trace(go.Scatter(y=[16, 24, 33, 21, 32, 13, 44, 32]))
fig.layout = go.Layout(hovermode="x unified")
fig.show()
```

```py title="Hover subplot"
import plotly.graph_objects as go
from plotly import data

# New in v5.21
# layout.hoversubplots define how hover effects expand to additional subplots.
# With hoversubplots=axis, hover effects are included on stacked subplots using the same axis when hovermode is set to x, x unified, y, or y unified.

layout = dict(
    hoversubplots="axis",
    title=dict(text="Stock Price Changes"),
    hovermode="x",
    grid=dict(rows=3, columns=1),
)
df = data.stocks()
traces = [
    go.Scatter(x=df["date"], y=df["AAPL"], xaxis="x", yaxis="y", name="Apple"),
    go.Scatter(x=df["date"], y=df["GOOG"], xaxis="x", yaxis="y2", name="Google"),
    go.Scatter(x=df["date"], y=df["AMZN"], xaxis="x", yaxis="y3", name="Amazon"),
]
fig = go.Figure(data=traces, layout=layout)
fig.show()
```

```py title="Customize hover text"
import plotly.graph_objects as go

fig = go.Figure(
    go.Scatter(
        x=[1, 2, 3, 4, 5],
        y=[2.02825, 1.63728, 6.83839, 4.8485, 4.73463],
        hovertemplate="<i>Price</i>: $%{y:.2f}"
        + "<br><b>X</b>: %{x}<br>"
        + "<b>%{text}</b>",
        text=["Custom text {}".format(i + 1) for i in range(5)],
    )
)
fig.add_trace(
    go.Scatter(
        x=[1, 2, 3, 4, 5],
        y=[3.02825, 2.63728, 4.83839, 3.8485, 1.73463],
        hovertemplate="Price: %{y:$.2f}<extra></extra>",  # removes trace name
    )
)
fig.add_trace(
    go.Pie(
        values=[2, 5, 3, 2.5],
        labels=["R", "Python", "Java Script", "Matlab"],
        text=["textA", "TextB", "TextC", "TextD"],
        hovertemplate="%{label}: <br>Popularity: %{percent} </br> %{text}",  # uses built-in 'percent' variable
    )
)
fig.layout = go.Layout(hoverlabel=go.layout.Hoverlabel(align="right"))
#  align: Sets the horizontal alignment of the text content within hover label box. Has an effect only if the hover label text spans more two or more lines
fig.show()
```

```py title="Spike"
import plotly.graph_objects as go

# showspikes: Determines whether or not spikes (aka droplines) are drawn for this axis. Note: This only takes affect when hovermode = closest
# spikesnap: Determines whether spikelines are stuck to the cursor or to the closest datapoints.
# spikemode: "toaxis": line is drawn from the data point to the axis; "across": line is drawn across the entire plot area; "marker": marker dot is drawn on the axis


fig = go.Figure(
    go.Scatter(
        x=[1, 2, 3, 4, 5],
        y=[2.02825, 1.63728, 6.83839, 4.8485, 4.73463],
    )
)
fig.layout = go.Layout(
    xaxis=go.layout.XAxis(showspikes=True, spikesnap="cursor", spikemode="across"),
    yaxis=go.layout.YAxis(showspikes=True),
    spikedistance=1000,
    hoverdistance=100,
)
fig.show()
```

## Shapes

```py title="Using Scatter Plot"
import plotly.graph_objects as go

# Repeat the initial point to close the shape
# Can have more shapes either by adding more traces or interrupting the series with 'None'.

fig = go.Figure(
    go.Scatter(
        x=[0, 1, 2, 0, None, 3, 3, 5, 5, 3],
        y=[0, 2, 0, 0, None, 0.5, 1.5, 1.5, 0.5, 0.5],
        fill="toself",
    )
)
fig.show()
```

```py title="Add Shape Func"
import plotly.graph_objects as go

# type: Sets the shape type - line, rect, circle, path
# shape.xref: Refers to axis id or 'paper' which refer to the entire x axis of the plot
# shape.layer: 'below' or 'above' the traces. 'between' is present in 5.21
# LINE: Line is drawn from (x0, y0) to (x1, y1). line.dash: Sets the line style
# CIRCLE: Circle is drawn within the bounding box defined by (x0, y0) and (x1, y1)

fig = go.Figure()
fig.layout = go.Layout(xaxis=dict(range=[0, 8]), yaxis=dict(range=[0, 4]))
fig.add_shape(
    type="line",
    x0=2,
    y0=3,
    x1=5,
    y1=3,
    xref="x",
    yref="y",
    line={"color": "LightSeaGreen", "width": 4, "dash": "dashdot"},
    # label=dict( # LABEL IS SUPPORTED IN PLOTLY 5.14 AND ABOVE
    #     texttemplate="Slope of %{slope:.3f} and length of %{length:.3f}",
    #     font=dict(size=20),
    # ),
)
fig.add_shape(
    type="rect",
    xref="paper",
    yref="paper",
    x0=0.25,
    y0=0,
    x1=0.5,
    y1=0.5,
    line={"color": "RoyalBlue", "width": 2},
    fillcolor="LightSkyBlue",
)
fig.add_shape(
    type="circle",
    fillcolor="PaleTurquoise",
    x0=5,
    y0=1,
    x1=6,
    y1=2,
    line_color="LightSeaGreen",
)
fig.show()
```

## Charts

![Plotly charts](./plotly_charts.drawio.svg)

## Chart - Bar

A bar chart presents categorical data with rectangular bars

```py title="grouped"
# barmode: Determines how bars at the same location coordinate are displayed on the graph. Values:
# "stack": stacked on top of one another
# "relative": stacked on top of one another, with negative values below the axis, positive values above
# "group": plotted next to one another centered around the shared location
# "overlay": plotted over one another, you might need to an "opacity" to see multiple bars.

branches = ["CSE", "Mech", "Electronics"]
fy = [23, 17, 35]
sy = [20, 23, 30]
ty = [30, 20, 15]
trace1 = go.Bar(x=branches, y=fy, name="FY")
trace2 = go.Bar(x=branches, y=sy, name="SY")
trace3 = go.Bar(x=branches, y=ty, name="TY")
data = [trace1, trace2, trace3]
layout = go.Layout(barmode="group")
fig = go.Figure(data=data, layout=layout)
fig.show()
```

## Chart - Pie

A Pie Chart displays only one series of data. Data points are shown as a percentage of the whole pie.

```py title="pie basic"
# Two required arguments are labels and values.

langs = ["C", "C++", "Java", "Python", "PHP"]
students = [23, 17, 35, 29, 12]
trace = go.Pie(labels=langs, values=students)
data = [trace]
fig = go.Figure(data=data)
fig.show()
```

```py title="donut"
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Hole: Sets the fraction of the radius to cut out of the pie. Use this to make a donut chart.
# fig.add_annotation: Create and add a new annotation to the figure's layout

parties = ["BJP", "CONGRESS", "DMK", "TMC", "YSRC", "SS", "JDU", "BJD", "BSP", "OTH"]
seats = [303, 52, 23, 22, 22, 18, 16, 12, 10, 65]
percent = [37.36, 19.49, 2.26, 4.07, 2.53, 2.10, 1.46, 1.66, 3.63, 25.44]

fig = make_subplots(rows=1, cols=2, specs=[[{"type": "pie"}, {"type": "pie"}]])
fig.add_pie(labels=parties, values=seats, hole=0.4, name="seats", row=1, col=1)
fig.add_pie(labels=parties, values=percent, hole=0.4, name="vote share", row=1, col=2)
fig.add_annotation(
    text="Seats",
    x=0.205,
    y=0.5,
    showarrow=False,
    font=go.layout.annotation.Font(size=16),
)
fig.add_annotation(
    text="Vote Share",
    x=0.815,
    y=0.5,
    showarrow=False,
    font=go.layout.annotation.Font(size=16),
)
fig.show()
```

## Chart - Scatter Plot

Scatter plots are used to plot data points on a horizontal and a vertical axis to show how one variable affects another.

```py title="scatter mode"
import plotly.graph_objects as go
import numpy as np

N = 100
x_vals = np.linspace(0, 1, N)
y1 = np.random.randn(N) + 5
y2 = np.random.randn(N)
y3 = np.random.randn(N) - 5

trace0 = go.Scatter(x=x_vals, y=y1, mode="markers", name="markers")
trace1 = go.Scatter(x=x_vals, y=y2, mode="lines+markers", name="line+markers")
trace2 = go.Scatter(x=x_vals, y=y3, mode="lines", name="line")
data = [trace0, trace1, trace2]
fig = go.Figure(data=data)
fig.show()
```

```py title="Stack Area Chart"
import plotly.graph_objects as go

# stackgroup: Set several scatter traces (on the same subplot) to the same stackgroup in order to add their y values (or their x values if `orientation` is "h")
#             It turns `fill` on by default, using "tonexty" ("tonextx") if `orientation` is "h" ("v") and sets the default `mode` to "lines" irrespective of point count
# groupnorm: Sets the normalization for the sum of the stackgroup - "fraction' & 'percent'.
#            Should be set on the first trace of the stackgroup.

x = ["Winter", "Spring", "Summer", "Fall"]

fig = go.Figure()
fig.add_trace(
    go.Scatter(
        x=x,
        y=[40, 60, 40, 10],
        line=dict(width=0.5, color="rgb(131, 90, 241)"),
        stackgroup="one",
    )
)
fig.add_trace(
    go.Scatter(
        x=x,
        y=[20, 10, 10, 60],
        line=dict(width=0.5, color="rgb(111, 231, 219)"),
        stackgroup="one",
    )
)
fig.add_trace(
    go.Scatter(
        x=x,
        y=[40, 30, 50, 30],
        line=dict(width=0.5, color="rgb(184, 247, 212)"),
        stackgroup="one",
    )
)

fig.update_layout(yaxis_range=(0, 100))
fig.show()
```

```py title="scatterGL"
import plotly.graph_objects as go
import numpy as np

# Implement WebGL with Scattergl() in place of Scatter() for increased speed, improved interactivity, and the ability to plot even more data.
# WebGL (Web Graphics Library) is a NATIVE JavaScript API for rendering interactive 2D and 3D graphics within any compatible web browser

N = 100000
x = np.random.randn(N)
y = np.random.randn(N)
trace0 = go.Scattergl(x=x, y=y, mode="markers")
data = [trace0]
layout = go.Layout(title="scattergl plot")
fig = go.Figure(data=data, layout=layout)
fig.show()
```

## Chart - Bubble

A bubble chart displays three dimensions of data - x, y, size. Bubble chart is a variation of the scatter plot, in which the data points are replaced with bubbles.

```py title="bubble basic"
import plotly.graph_objects as go

company = ["A", "B", "C"]
products = [13, 6, 23]
sale = [2354, 5423, 4251]
share = [23, 47, 30]
fig = go.Figure(
    data=[
        go.Scatter(
            x=products,
            y=sale,
            hovertext=[
                "company:" + c + "share:" + str(s) + "%"
                for c in company
                for s in share
                if company.index(c) == share.index(s)
            ],
            mode="markers",
            marker=go.scatter.Marker(size=share, color=["blue", "red", "yellow"]),
        )
    ]
)
fig.show()
```

## Chart - Table

Useful for detailed data viewing in a grid of rows and columns.

```py title="table basic"
import plotly.graph_objects as go

# Important parameters: header (first row), cells (list of columns)

headers = ["Teams", "Mat", "Won", "Lost", "Tied", "NR", "Pts", "NRR"]
teams = ["Ind", "Aus", "Eng", "Nz", "Pak", "Sri", "Sa", "Ban", "Wi", "Afg"]
matches = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
wins = [7, 7, 6, 5, 5, 3, 3, 3, 2, 0]
losses = [1, 2, 3, 3, 3, 4, 5, 5, 6, 9]
ties = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
nrs = [1, 0, 0, 1, 1, 2, 1, 1, 1, 0]
pts = [15, 14, 12, 11, 11, 8, 7, 7, 5, 0]
nrr = [0.809, 0.868, 1.152, 0.175, -0.43, -0.919, -0.03, -0.41, -0.225, -1.322]

trace = go.Table(
    header=go.table.Header(
        values=headers,
        line=go.table.header.Line(color="gray"),
        fill=go.table.header.Fill(color="lightskyblue"),
        align="left",
    ),
    cells=go.table.Cells(
        values=[teams, matches, wins, losses, ties, nrs, pts, nrr],
        line=go.table.cells.Line(color="gray"),
        fill=go.table.cells.Fill(color="lightcyan"),
        align="left",
    ),
)
data = [trace]
fig = go.Figure(data=data)
fig.show()
```

## Chart - Histogram

Histogram is a graphical tool that visualizes the distribution of numerical data. It appears similar to bar graph, but, a bar graph relates two variables, whereas a histogram relates only one.

| parameter                          | usage                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Bins (or bucket)                   | It divides the entire range of values into a series of intervals and then count how many values fall into each interval                   |
| normalization - default            | Span of each bar corresponds to the number of occurrences (i.e. the number of data points lying inside the bins)                          |
| normalization - percentage         | Span of each bar corresponds to the percentage of occurrences w.r.t the total number of sample points. Sum of all bin HEIGHTS equals 100% |
| normalization - probability        | Span of each bar corresponds to the fraction of occurrences w.r.t the total number of sample points. Sum of all bin HEIGHTS equals 1      |
| normalization - density            | `=(number_of_occurrences / size_of_bin_interval)`. Sum of all bin AREAS equals the total number of sample points                          |
| normalization- probability density | Area of each bar corresponds to the probability that an event will fall into the corresponding bin. Sum of all bin AREAS equals 1         |
| hist function                      | count (default), sum, avg, min, or max                                                                                                    |
| norm + func                        | Histogram is calculated in two sequential steps: data counting (binning) and then scaling (normalization)                                 |
| cumulative                         | Histogram can be set to display cumulative distribution of values in successive bins                                                      |

```py title="histogram example"
import plotly.graph_objects as go
import numpy as np

x1 = np.array([22, 87, 5, 43, 56, 73, 55, 54, 11, 20, 51, 5, 79, 31, 27])
data = [
    go.Histogram(
        x=x1,
        y=x1,
        histfunc="sum",
        histnorm="probability",
        cumulative=go.histogram.Cumulative(enabled=True),
    )
]  # 'y' is important for binning function
fig = go.Figure(data)
fig.show()
```

## Chart - Box Plot

Box plot is a graphical tool that visualizes the distribution of numerical data **through its quartiles**.

- It displays "five-number summary": minimum, first quartile (Q1), median (Q2), third quartile (Q3), and maximum.
- "Box" represents the inter-quartile range
- Horizontal (w.r.t box) line inside mark the median.
- "Whiskers" extend from the box to the minimum and maximum values.
- Individual points are plotted to show outliers.

```py title="box basic"
import plotly.graph_objects as go

# boxmean:  If True, the mean is drawn as a dashed line. If "sd" the standard deviation is also drawn
# boxpoints:
#   If "all", all data points are shown.
#   If "outliers", only the outliers are shown.
#   If "suspectedoutliers", the outlier points are shown and points either less than 4"Q1-3"Q3 or greater than 4"Q3-3"Q1 are highlighted.
#   If False, no data points are shown.

trace1 = go.Box(
    y=[1140, 1460, 489, 594, 502, 508, 370, 200, -400],
    # boxpoints="suspectedoutliers",
    # boxmean="sd",
)
data = [trace1]
fig = go.Figure(data)
fig.show()
```

## Chart - Violin Plot

Violin plots are similar to box plots, except that they also show the probability density (Kernel Density Estimate (KDE)) of the data at different values.

```py title="violin example"
import plotly.graph_objects as go
import numpy as np

np.random.seed(10)
c1 = np.random.normal(100, 10, 200)
c2 = np.random.normal(80, 30, 200)
trace1 = go.Violin(y=c1, meanline=go.violin.Meanline(visible=True))  # mean line
trace2 = go.Violin(y=c2, box=go.violin.Box(visible=True))  # box plot inside violin
data = [trace1, trace2]
fig = go.Figure(data=data)
fig.show()
```

## Chart - Heatmap

A heatmap is a graphical representation of data where the individual values contained in a matrix are represented as colors. The darker the shade, the higher the value

```py title="heatmap example"
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

vegetables = ["cucumber", "tomato", "lettuce", "asparagus", "potato", "wheat", "barley"]
farmers = ["Joe", "Bros", "Smith", "Tom", "Rob", "Ryan", "Park"]
harvest = np.array(  # row x column
    [
        [0.8, 2.4, 2.5, 3.9, 0.0, 4.0, 0.0],  # Joe vegetables
        [2.4, 0.0, 4.0, 1.0, 2.7, 0.0, 0.0],
        [1.1, 2.4, 0.8, 4.3, 1.9, 4.4, 0.0],
        [0.6, 0.0, 0.3, 0.0, 3.1, 0.0, 0.0],
        [0.7, 1.7, 0.6, 2.6, 2.2, 6.2, 0.0],
        [1.3, 1.2, 0.0, 0.0, 0.0, 3.2, 5.1],
        [0.1, 2.0, 0.0, 1.4, 0.0, 1.9, 6.3],
    ]
)
trace = go.Heatmap(
    x=vegetables, y=farmers, z=harvest, colorscale=px.colors.sequential.Viridis
)
data = [trace]
fig = go.Figure(data=data)
fig.show()
```

## Chart - Polar

Polar charts are useful when relationships between data points can be visualized in terms of radiuses and angles. Theta is numerical data points.

```py title="Polar example"
import plotly.graph_objects as go

trace = go.Scatterpolar(
    r=[0.5, 1, 2, 2.5, 3, 4],
    theta=[35, 70, 120, 155, 205, 240], # numerical data points
    mode="lines",
)
data = [trace]
fig = go.Figure(data=data)
fig.show()
```

## Chart - Radar

Similar to Polar, but has categorical values for theta. Radar is useful for displaying multivariate data.

Multivariate data refers to datasets with multiple variables/features (more than two) recorded for each observation.

```py title="Radar example"
import plotly.graph_objects as go

trace1 = go.Scatterpolar(
    r=[0.5, 1, 2, 2.5, 3, 4],  # feature 1
    theta=["A", "B", "C", "D", "E", "F"],  # categorical data points
    mode="lines",
    fill="toself",
)
trace2 = go.Scatterpolar(
    r=[5, 3, 6, 2, 9, 7],  # feature 2
    theta=["A", "B", "C", "D", "E", "F"],  # categorical data points
    mode="lines",
    fill="toself",
)
data = [trace1, trace2]
fig = go.Figure(data=data)
fig.show()
```

## Chart - Candlestick

```py title="Candlestick example"
import plotly.graph_objects as go
import datetime

open_data = [33.0, 33.3, 33.5, 33.0, 34.1]
high_data = [33.1, 33.3, 33.6, 33.2, 34.8]
low_data = [32.7, 32.7, 32.8, 32.6, 32.8]
close_data = [33.0, 32.9, 33.3, 33.1, 33.1]
date_data = ["10-10-2013", "11-10-2013", "12-10-2013", "01-10-2014", "02-10-2014"]
dates = [
    datetime.datetime.strptime(date_str, "%m-%d-%Y").date() for date_str in date_data
]

trace = go.Candlestick(
    x=dates, open=open_data, high=high_data, low=low_data, close=close_data
)  # always pass datetime object for x
data = [trace]
fig = go.Figure(data=data)
fig.show()
```

## Interactivity

Plotly provides interactivity by use of different controls on the plotting area such as buttons, dropdowns and sliders etc.

Use with `graph_objects.layout.Updatemenu`

![Plotly interactive](./plotly_interactive.drawio.svg)

## Adding Buttons/Dropdown

```py title="Method restyle"
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Box(y=[1140, 1460, 489, 594, 502, 508, 370, 200]))
fig.layout.update(
    updatemenus=[
        go.layout.Updatemenu(
            type="buttons",  # 'buttons', or 'dropdown'
            direction="left",  # 'left', 'right', 'up', or 'down'
            buttons=[
                go.layout.updatemenu.Button(
                    args=["type", "box"], label="Box", method="restyle"
                    # "box": single string value since we have one trace
                ),
                go.layout.updatemenu.Button(
                    args=["type", "violin"], label="Violin", method="restyle"
                ),
            ],
            pad=go.layout.updatemenu.Pad(r=2, t=2),  # padding
            active=0, # Determines which button (by index starting from 0) is considered active
            showactive=True,  # highlight active button
            x=0,
            xanchor="left",  # "left", "center" or "right"
            y=1.2,
            yanchor="top",  # "top", "middle" or "bottom"
        ),
    ]
)
fig.show()
```

```py title="Method update"
import plotly.graph_objects as go
import numpy as np
import math

xpoints = np.arange(0, math.pi * 2, 0.05)
y1 = np.sin(xpoints)
y2 = np.cos(xpoints)

fig = go.Figure()
fig.add_trace(go.Scatter(x=xpoints, y=y1, name="Sine"))
fig.add_trace(go.Scatter(x=xpoints, y=y2, name="cos", visible=False))
fig.layout.update(
    updatemenus=[
        go.layout.Updatemenu(
            type="buttons",
            buttons=[
                go.layout.updatemenu.Button(
                    label="first",
                    method="update",
                    args=[{"visible": [True, False]}, {"title": "Sine"}],
                    # [True, False]: array since we have two traces
                ),
                go.layout.updatemenu.Button(
                    label="second",
                    method="update",
                    args=[{"visible": [False, True]}, {"title": "Cos"}],
                ),
            ],
        )
    ]
)
fig.show()
```

```py title="Animation - move point on a curve"
import plotly.graph_objects as go

# xaxis.autorange=False necessary for consistent axis ranges during animation
# buttons.args=[None] will animate all frames. Use args=[[frame_name]] to animate specific frames.

N = 20
x = [i for i in range(N)]
y = [i**2 for i in x]
data = [
    go.Scatter(x=x, y=y, mode="lines", line=dict(width=2, color="blue")),
    go.Scatter(x=[x[0]], y=[y[0]], mode="markers", marker=dict(color="red", size=10)),
]
layout = go.Layout(
    xaxis=dict(range=[min(x) - 5, max(x) + 5], autorange=False),
    yaxis=dict(range=[min(y) - 50, max(y) + 50], autorange=False),
    updatemenus=[
        go.layout.Updatemenu(
            type="buttons",
            buttons=[
                go.layout.updatemenu.Button(
                    args=[None],
                    label="Play",
                    method="animate",
                )
            ],
        )
    ],
)
frames = [
    go.Frame(
        data=[
            go.Scatter(
                x=[x[k]], y=[y[k]], mode="markers", marker=dict(color="red", size=10)
            )
        ],
        traces=[1],  # fig.data[1] is updated by each frame
    )
    for k in range(N)
]

fig = go.Figure(data=data, layout=layout, frames=frames)
fig.show()
```

## Slider Control

```py title="Slider Example"
import plotly.graph_objects as go
import numpy as np

fig = go.Figure()

for step in np.arange(0, 5, 0.1):
    fig.add_trace(
        go.Scatter(
            visible=False,
            line=dict(color="blue", width=2),
            name=" = " + str(step),
            x=np.arange(0, 10, 0.01),
            y=np.sin(step * np.arange(0, 10, 0.01)),
        )
    )
fig.data[10].visible = True  # 10th trace set to visible

# Create and add slider
steps = []
for i in range(len(fig.data)):
    step = go.layout.slider.Step(
        method="restyle",
        args=[
            "visible",
            [True if i == j else False for j in range(len(fig.data))],
        ],  # Toggle i'th trace to "visible"
        label=str(i),
    )
    steps.append(step)
slider = go.layout.Slider(active=10, steps=steps)
fig.layout.update(sliders=[slider])
fig.show()
```
