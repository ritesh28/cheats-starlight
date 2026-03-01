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
| `data.unique()`                     | Return unique values. Type: `numpy.ndarray`                                         |
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

| Syntax          | Purpose                                                         |
| --------------- | --------------------------------------------------------------- |
| `df.index`      | get row index. Index is an array-like object of type `pd.Index` |
| `df.columns`    | get column names. Type `pd.Index`                               |
| `df.values`     | get values. Type: `numpy.ndarray`                               |
| `df.T`          | Transpose. Swap rows & columns                                  |
| `df.head()`     | display top entries                                             |
| `df.tail()`     | display bottom entries                                          |
| `df.describe()` | computes several common aggregates for each column              |

| Indexing & Slicing - syntax                           | Purpose                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `df[<column-name>]` (Indexing)                        | Access Series of column data                                            |
| `df[index:index]` (Slicing)                           | Return rows. Type: `DataFrame`                                          |
| `df.iloc[:3, :2]` or `df.loc[:'Illinois', :'pop']`    | indexer attribute. `(i)loc[row, column]`. Type: `Series` or `DataFrame` |
| `data.loc[data["density"] > 100, ["pop", "density"]]` | masking & fancy indexing                                                |

## Operating on Data

| Syntax                           | Explain                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `np.square(<ser_or_df>)`         | any NumPy ufunc will work on Pandas Series and DataFrame objects                                             |
| `pop_ser_or_df / area_ser_or_df` | resulting array contains the union of indices. A missing value is marked with `NaN`                          |
| `A.add(B, fill_value=0)`         | fill missing value. Default: `NaN` (floating type)                                                           |
| `df - df.iloc[0]`                | Operate row-wise (Default, `axis=1 (columns)`). Operation b/w dataframe & series (with column name as index) |
| `df.subtract(df['R'], axis=0)`   | Operate column-wise. Operation b/w dataframe & series (with same index of dataframe)                         |
| `df.mean(axis=1)`                | aggregate within each row. Column axis is collapsed                                                          |
| `df.<operation>(inplace=True)`   | modify the object in place (do not create a new object)                                                      |

## Null Values

| Syntax           | Description                                       |
| ---------------- | ------------------------------------------------- |
| `data.isnull()`  | Generate a Boolean mask indicating missing values |
| `data.notnull()` | Opposite of `isnull()`                            |
| `data.dropna()`  | Removes NA values                                 |
| `data.fillna()`  | Fills in NA values                                |

| DataFrame Scenario - Syntax                        | Explain                                                                                                                |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `df.dropna()`                                      | Drop rows having any `null` value                                                                                      |
| `df.dropna(axis='columns')` or `df.dropna(axis=1)` | Drop columns having any `null` value. Note: no collapse analogy                                                        |
| `df.dropna(how='all')`                             | Drop rows having ALL `null` values. Default: `how='any'`                                                               |
| `df.dropna(thresh=3)`                              | Drop rows having NON-NULL values less than threshold.                                                                  |
| `data.fillna(5)`                                   | fill NA entries with a single value                                                                                    |
| `df.fillna(method='ffill', axis=1)`                | forward-fill to propagate previous value forward. Use value of previous column, same index. Skip if no previous column |
| `df.fillna(method='bfill', axis=1)`                | back-fill to propagate next value backward. Use value of next column, same index. Skip if no next column               |

## Hierarchical/Multi Indexing

| Syntax                                                                    | Description                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `index = pd.MultiIndex.from_tuples([('a',1), ('a',2), ('b',1), ('b',2)])` | multi-index from the tuples                                                                 |
| `index = pd.MultiIndex.from_arrays([['a', 'a', 'b', 'b'], [1, 2, 1, 2]])` | multi-index from 2 or more index array                                                      |
| `index = pd.MultiIndex.from_product([['a', 'b'], [1, 2]])` (Preferred)    | multi-index from Cartesian product of single indices                                        |
| `ser[:, 1]`                                                               | access all data for which the second index is `1`                                           |
| `ser.unstack(level=-1)`                                                   | Series with MultiIndex produces DataFrame. `level` : int, str, or list. default: last level |
| `df.stack()`                                                              | opposite of `unstack`. Returns `Series`                                                     |
| `ser_or_df.index.names = ['state', 'year']` or `pd.MultiIndex.*(names=)`  | multi-index level names                                                                     |
| `ser_or_df.sort_index()`                                                  | sort object by index labels                                                                 |
| `ser_or_df.reset_index()`                                                 | turn the index labels into columns. Set `name` param for the original Series values         |
| `ser_or_df.set_index(['col_1', 'col_2'])`                                 | opposite of `reset_index`. return multi-indexed data                                        |

| Indexing & Slicing - 2 level Series | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `ser[level_1_index, level_2_index]` | Access single item in 2 level series             |
| `ser[level_1_index]`                | Partial indexing                                 |
| `ser[level_1_index:level_1_index]`  | Partial slicing as long as Multi-index is SORTED |
| `ser[:, level_2_index]`             | Access series with `(*, level_2_index)` key      |
| `ser[ser > 22000000]`               | masking                                          |
| `ser[['California', 'Texas']]`      | fancy indexing                                   |

| DataFrame - 2 level col & 2 level index                             | Description                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| `df['col_lev_1', 'col_lev_2']`                                      | Returns Series                                               |
| `df.loc[:, ('col_lev_1', 'col_lev_2')]`                             | Returns Series                                               |
| `df.iloc[:2, :2]`                                                   | Returns first-2-row & first-2-column grid                    |
| `idx = pd.IndexSlice; df.loc[idx[:, row_lev_2], idx[:, col_lev_2]]` | Use `IndexSlice` when working with slices within tuple index |

## Combining Dataset - Concat & Append

| Syntax                                  | Description                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `pd.concat([df1, df2])`                 | By default, row-wise concatenation. `axis=0`                                                                  |
| `pd.concat([df1, df2], axis="columns")` | column-wise concatenation. `axis=1`                                                                           |
| `pd.concat(..., verify_integrity=True)` | concatenation will raise an exception if there are duplicate indices                                          |
| `pd.concat(..., ignore_index=True)`     | Original index are ignored. Result index: `range(0, size)`                                                    |
| `pd.concat(..., keys=['x', 'y'])`       | Construct hierarchical index using the passed keys as the outermost level. `df1` with label `x`               |
| `pd.concat(..., join='inner')`          | final column set is interaction of input columns. By default, join is a union of input columns `join='outer'` |
| `df1.append(df2)` (AVOID IT)            | Same as `pd.concat([df1, df2])`. Not an efficient method                                                      |

## Combining Dataset - Merge & Join

| Syntax                                                                     | Explanation                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `pd.merge(df1, df2, on='<common-column>')`                                 | explicitly specify the name of the key column. Takes single or list of column names  |
| `pd.merge(df1, df2, left_on="col_1", right_on="col_2")`                    | merge two datasets with different column names                                       |
| `pd.merge(df1, df2, left_index=True, right_index=True)` or `df1.join(df2)` | use df1 & df2 indices as the key for merging                                         |
| `pd.merge(df1a, df3, left_index=True, right_on='name')`                    | mixing indices and columns                                                           |
| `pd.merge(df1, df2, how='<type_of_merge>')`                                | Similar to SQL joins. Values: left, right, outer, inner, cross. Default: inner       |
| `pd.merge(df8, df9, on="name", suffixes=["_L", "_R"])`                     | Suffixes for the overlapping column names (other than key column). Default: `_x, _y` |

## Grouping

| Syntax                                                                  | Description                                                                                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `df.groupby("key").sum()`                                               | Aggregation. Returns summation column-wise for each group                                      |
| `df.groupby('key').aggregate(['min', np.median, max])`                  | Aggregation. Return multi-index column `(col-name, agg-item)` & `group-item` indices DataFrame |
| `df.groupby("key").aggregate({"col1": "min", "col2": "max"})`           | Aggregation. Different aggregation for different column                                        |
| `df.groupby("key").filter(lambda grp: grp["col2"].min() > 2)`           | Filter rows based on group properties. `filter(group: DataFrame) -> bool`                      |
| `df.groupby('key').transform(lambda grp_col: grp_col - grp_col.mean())` | Transform column-wise per group                                                                |
| `df.groupby("key").apply(lambda grp: grp["data1"] / 2)`                 | Apply any func to grouping df                                                                  |

| Transform                                                                           | Apply                                                                              |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `transform(grp_col: Series) -> Series`                                              | `apply(grp: DataFrame) -> df or series or scalar`                                  |
| `transform()` passes each column for each group individually as a Series            | `apply()` passes all the columns for each group as a df                            |
| `transform()` returns a sequence (1D Series, array or list) of same length as group | `apply()` returns a scalar, or a Series or DataFrame (or numpy array or even list) |
| `df.groupby().transform` returns same shape as the original df                      | `df.groupby().apply` returns df/ser with extra outer multi-index `key`             |
| Good performance                                                                    | Bad Performance. Last option                                                       |

| Option to specify split key                                                | Syntax                                                            |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Any series or list with a length matching that of df                       | `df.groupby(df['key'])`                                           |
| A dict that maps index values to the group keys                            | `df2.groupby({'A': 'vowel', 'B': 'consonant', 'C': 'consonant'})` |
| Similar to mapping, pass func that will input index value and output group | `df2.groupby(str.lower)`                                          |
| Multi-index grouping                                                       | `df2.groupby([str.lower, mapping])`                               |

## Pivot Tables

| Type           | Syntax                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| basic          | `titanic.pivot_table("survived", index="sex", columns="class")`. Group by class and gender, select survival, apply a mean aggregate         |
| multilevel     | `titanic.pivot_table('survived', ['sex', age_dis_ctg], [fare_dis_ctg, 'class'])`. Use `pd.cut` or `pd.qcut` for discrete category (dis_ctg) |
| missing data   | `titanic.pivot_table(..., fill_value=)` or `titanic.pivot_table(..., dropna=True)`                                                          |
| aggregate      | `titanic.pivot_table(index='sex', columns='class', aggfunc={'survived':sum, 'fare':'mean'})`. Note: No `values` value                       |
| compute totals | `titanic.pivot_table(..., margins=True, margins_name='All')`                                                                                |

## Misc

| Syntax                             | Usage                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pd.read_csv()`                    | read CSV file                                                                                                            |
| `pd.cut(series, bins=[0, 18, 80])` | Create `(0, 18] & (18, 80]` bins. Useful for going from a continuous variable to a categorical variable                  |
| `pd.qcut(titanic["fare"], q=4)`    | Quantile-based discretization. It divides data into bins that each contain approximately the same number of observations |
