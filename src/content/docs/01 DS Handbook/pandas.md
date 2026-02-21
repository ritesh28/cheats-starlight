---
title: Pandas
---

![Pandas Image](./pandas.drawio.svg)

## Pandas Object - Series

| Syntax                                                                 | Purpose                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| `data = pd.Series([0.25, 0.5, 0.75, 1.0], index=['a', 'b', 'c', 'd'])` | create. `index` is optional. Default index: `range(0, size)` |
| `data = pd.Series({'aus': 200, 'ind': 300, 'usa': 600})`               | create using dictionary                                      |
| `data.values`                                                          | get all values. Type: `numpy.ndarray`                        |
| `data.index`                                                           | get index. Index is an array-like object of type `pd.Index`  |
| `data[<index>]` or `data[<up-index>:<down-index>]` (slicing)           | get scalar or series subset                                  |

| Index declaration scenario                       | Equivalent Series object                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `pd.Series(5, index=[100, 200, 300])`            | values as `[5, 5, 5]`                                                  |
| `pd.Series({2:'a', 1:'b', 3:'c'})`               | index are sorted as `pd.Series(['b', 'c', 'a'], index=[1, 2, 3])`      |
| `pd.Series({2:'a', 1:'b', 3:'c'}, index=[3, 2])` | populated only with the explicitly identified keys `values=['c', 'a']` |

## Pandas Object - DataFrame

| Ways to create DataFrame object                 | Syntax                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| From a dictionary of Series objects (preferred) | `pd.DataFrame({'population': population_series, 'area': area_series})`                |
| From a single Series object                     | `pd.DataFrame(population, columns=['population'])`                                    |
| From a list of dicts                            | `pd.DataFrame([{'a': 1, 'b': 2}, {'b': 3, 'c': 4}])`. Missing values are marked `NaN` |
| From a 2D NumPy array                           | `pd.DataFrame(np.random.rand(3, 2), columns=['foo', 'bar'], index=['a', 'b', 'c'])`   |

| Syntax                 | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `dfObj.index`          | get row index. Index is an array-like object of type `pd.Index` |
| `dfObj.columns`        | get column names of type `pd.Index`                             |
| `dfObj[<column-name>]` | Access Series of column data                                    |

## Pandas Object - Index
