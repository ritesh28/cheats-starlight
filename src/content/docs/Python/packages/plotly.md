---
title: PyTorch v5.9.0
---

## Migrate Version 3 to 4 (DELETE LATER)

- The preferred import location of the `make_subplots` function is now `plotly.subplots.make_subplots`. For compatibility, this function is still available as `plotly.tools.make_subplots`.
- In version 4, the default value of `print_grid` is False.
- `row_heights` argument to replace `row_width`
- Prior to version 4, shared y-axes were implemented by associating a single yaxis object with multiple xaxis objects, and vica versa. In version 4, every 2D Cartesian subplot has a dedicated x-axis and and a dedicated y-axis. Axes are now "shared" by being linked together using the matches axis property. The output of the `.print_grid` method on a figure created using make_subplots can be used to identify which axis objects are associated with each subplot.
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
