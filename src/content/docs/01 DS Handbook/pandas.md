---
title: Pandas
---

![Pandas Image](./pandas.drawio.svg)

## Pandas Object - Series

| Value type | Index declaration scenario                                             | Equivalent Series object                                               |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Scalar     | `pd.Series(5, index=[100, 200, 300])`                                  | values as `[5, 5, 5]`                                                  |
| List       | `data = pd.Series([0.25, 0.5, 0.75, 1.0])`                             | default index as `range(0, size)`                                      |
| List       | `data = pd.Series([0.25, 0.5, 0.75, 1.0], index=['a', 'b', 'c', 'd'])` |                                                                        |
| Dict       | `pd.Series({2:'a', 1:'b', 3:'c'})`                                     | index are sorted as `pd.Series(['b', 'c', 'a'], index=[1, 2, 3])`      |
| Dict       | `pd.Series({2:'a', 1:'b', 3:'c'}, index=[3, 2])`                       | populated only with the explicitly identified keys `values=['c', 'a']` |

| Data Indexing & Selection - Syntax  | Description                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `data.values`                       | get values. Type: `numpy.ndarray`                                                   |
| `data.index`                        | get index. Index is an array-like object of type `pd.Index`                         |
| `data[<index>]`                     | explicit index when indexing. `data[1]` returns value with index (not position) `1` |
| `data[<index-int>:<index-int>]`     | implicit index when slicing. `data[1:3]` returns values at position `1` & `2`       |
| `data.loc[1]` or `data.loc[1:3]`    | indexer attribute. Always references the explicit index                             |
| `data.iloc[1]` or `data.iloc[1:3]`  | indexer attribute. Always references the implicit index                             |
| `data[(data > 0.3) & (data < 0.8)]` | masking                                                                             |
| `data[['a', 'e']]`                  | fancy indexing                                                                      |

## Pandas Object - DataFrame

| Ways to create DataFrame object          | Syntax                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| dictionary of Series objects (preferred) | `pd.DataFrame({'population': population_series, 'area': area_series})`                |
| single Series object                     | `pd.DataFrame(population_series, columns=['population'])`                             |
| list of dicts                            | `pd.DataFrame([{'a': 1, 'b': 2}, {'b': 3, 'c': 4}])`. Missing values are marked `NaN` |
| 2D NumPy array                           | `pd.DataFrame(np.random.rand(3, 2), columns=['foo', 'bar'], index=['a', 'b', 'c'])`   |

| Syntax                                                | Purpose                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| `df.index`                                            | get row index. Index is an array-like object of type `pd.Index` |
| `df.columns`                                          | get column names. Type `pd.Index`                               |
| `df.values`                                           | get values. Type: `numpy.ndarray`                               |
| `df.T`                                                | Transpose. Swap rows & columns                                  |
| `df[<column-name>]` (Indexing)                        | Access Series of column data                                    |
| `df[index-str:index-str]` (Slicing)                   | Return rows. Same as `df[index-str:index-str, :]`               |
| `data[<index-int>:<index-int>]`                       | implicit index when slicing. `df[1:3]` returns row 1 & 2        |
| `df.iloc[:3, :2]` or `df.loc[:'Illinois', :'pop']`    | indexer attribute. `(i)loc[row, column]`                        |
| `data.loc[data["density"] > 100, ["pop", "density"]]` | masking & fancy indexing                                        |
