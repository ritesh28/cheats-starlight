---
title: PyTorch v5.9.0
---

## Migrate Version 3 to 4 (DELETE LATER)

- Online features (`plotly.plotly`) moved to `chart-studio` package
- In version 3, the `add_trace` and `add_{trace_type}` methods (e.g. `add_scatter`, `add_bar`, etc.) graph object figure method returned a reference to the newly created trace. In version 4, these methods return a reference to the calling figure.
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
# .data: A tuple of the figure's trace objects

fig = go.Figure()
fig.add_trace(go.Scatter(y=[2, 3, 1]))
scatter = fig.data[-1]
scatter.marker.size = 30
fig.show()
```

```py title="exporting figure"
import plotly.io as pio

pio.write_html(fig, file="first_figure.html", auto_open=True)
pio.write_image(fig, 'figure.png')
```
