---
title: PyTorch v5.9.0
---

## Migrate Version 3 to 4 (DELETE LATER)

- The legacy online-only `GraphWidget` class has been removed. Please use the `plotly.graph_objects.FigureWidget` class instead

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

````py title="subplot type"


## Different charts

### Bar Chart

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
````

### Pie Chart

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

### Scatter Plot

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

### Bubble Chart

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

### Table Plot

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

### Histogram

Histogram is an accurate representation of the distribution of numerical data. It appears similar to bar graph, but, a bar graph relates two variables, whereas a histogram relates only one.

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

```py title="histogram ex"
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

### Box Plot
