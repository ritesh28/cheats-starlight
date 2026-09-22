---
title: Pandas
---

- Pandas is built on top of NumPy. NumPy: `ndarray` object; Pandas: `DataFrame`, `Series`, `Index` objects
- Index:
  - Immutable **ordered** array-like structure
  - It has set-like function definition. e.g. `indA.intersection(indB)` or `indA & indB`
  - Index object may contain **repeated** values. Repeated indices are valid but the outcome is often undesirable
  - Indices are **preserved** during computation of Series/DataFrame
  - 2 variants: row-index and column-index (column names)
- Series:
  - 1D array of indexed data
  - `ndarray` has implicitly defined integer index while `Series` has explicitly defined index associated with the values
  - Think Series as dictionary - a structure that maps typed keys to a set of typed values
  - Indices even can be noncontiguous or non-sequential indices. e.g. `index=[2, 5, 3, 7]`
- DataFrame:
  - 2D array with row INDICES and column NAME
  - Think DataFrame as dictionary (same as Series) - maps a column name to a Series of column indexed-data
  - In 2D NumPy array, `data[0]` will return the first row. For DataFrame, `data['col0']` will return the first column
  - 'axis' keyword in operation:
    1. Aggregations (`sum()`, `min()`): which axis to collapse, crush, or eliminate. `axis=0` (default) means 'Collapse Rows' i.e. You get a summary value for each column
    2. Math Operators (`+, -, *, /`): which axis to match up, glue together, and broadcast along. `axis=1` (default) means Match Columns / Horizontal Broadcast i.e. operate row-by-row
- Missing Data
  - In general, there are 2 strategies to indicate the presence of missing data:
    1. Masking Approach: A separate boolean array, same size as original array, with True set for missing data. Con: Adds overhead in both storage and computation
    2. Sentinel Approach: (Preferred) Use a sentinel (guard) value to indicate a missing value. E.g. -9999 for int. 'NaN' for floating, 'None' for object typed values (slow performance, AVOID IT)
  - In Pandas, missing data is marked as `NaN` (floating type) value
  - Unlike Numpy, Pandas convert `None` to `NaN` (if dtype != object)
    - `np.array([1, np.nan, 2, None]) # array([1, nan, 2, None], dtype=object)`
    - `pd.Series([1, np.nan, 2, None]) # ser[3]=NaN, ser.dtype= float64`
- Ultimate Rules of Thumb for Defaults:
  1. If it reduces the DataFrame (Aggregations & Data Cleaning): Methods like .sum(), .dropna(), .fillna() default to axis=0 because they focus on operations running down the rows
  2. If it takes a Series and broadcasts it (Basic Math Operations): Operators like `+, -, *, /` and their method forms (.add(), .sub()) default to axis=1 to match column names
- Hierarchical/Multi Indexing:
  - Usage: Allows to store higher-dimensional data in Series (1D) and DataFrame (2D). Each extra level in a multi-index represents an extra dimension
  - Pandas provide 3D `Panel` and 4D `Panel4D` (Less popular)
  - `MultiIndex` type:
    - Think MultiIndex as array of tuple: `[('California', 2000), ('California', 2010), ... ('Texas', 2010)]`
    - `MultiIndex(levels=[['California', 'New York', 'Texas'], [2000, 2010]], labels=[[0, 0, 1, 1, 2, 2], [0, 1, 0, 1, 0, 1]])`
    - '0' in `labels[0]` represents California; '0' in `labels[1]` represents 2000
  - Thumb Rule for Slicing: Index needs to be **sorted** or else many of the MultiIndex slicing operations will fail
  - Partial Indexing/slicing: It allows indexing/slicing just one of the levels in the index. The result is same object, with the lower-level indices maintained
- Merge (Join DB):
  - Similar to Database join
  - NOTE: merge in general discards the index, except in the special case of merges by index
  - By default, Concatenation is row-wise; Merge is column-wise
  - 3 categories:
    1. one-to-one: key column do not contain duplicate entries. Very similar to column concatenation
    2. many-to-one: one of the two key columns contains duplicate entries. Resulting DataFrame will preserve those duplicate entries as appropriate
    3. many-to-many: Both key columns contains duplicate entries. Similar to DB CROSS JOIN
- Grouping:
  - `df.groupby('key')` returns `DataFrameGroupBy`. Mental Model: `<key-value>: dataFrame`
  - `df.groupby('key')['col-name']` returns `SeriesGroupBy`. Mental Model: `<key-value>: series`
  - GroupBy object Does **NO actual computation** until aggregation is applied
  - It supports iteration (`filter()`, `transform()`, `apply()`). Use `for key_name, group_df in df.groupby('key'):` last option
  - Dispatch methods:
    - Any method not explicitly implemented by the GroupBy object will be passed through and called on each individual group (df or series objects)
    - E.g. `df.groupby(key)[col-name].describe()`
- Pivot Table:
  - Mental Model: multidimensional version of GroupBy aggregation
  - Both are same:
    - `titanic.groupby(["sex", "class"])["survived"].aggregate("mean").unstack()`
    - `titanic.pivot_table("survived", index="sex", columns="class")`
- Vectorized String Operations: Deals with handling and manipulating string data
  - These methods skips missing values. It just perform operation on the string value
  - `series.str.*` ('str' attribute) under which all string methods are present
- Time Series:
  - Sequence of data points in chronological order, where the index is a time-aware index, typically a `DatetimeIndex`
  - It is build on Python native `datetime` package & Numpy's `numpy.datetime64` & `numpy.timedelta64`
  - Fundamental data structures: timestamp (represents a specific point in time), period (represents a span/interval of time) & time-delta (represents a length of time since some given time)
  - Operation:
    - Resampling: It is the process of resetting frequency at a higher or lower value
    - Shifting: It is the process of moving data backward or forward in time
    - Rolling/Windowing: Creates a moving or "rolling" window of a specified size and then performs a calculation on the data within that window
- `eval()` & `query()`:
  - `eval()` & `query()` allow you to directly access C-speed operations (fast) without costly allocation of intermediate arrays (less memory)
  - They rely on `Numexpr` package
  - `mask = (x > 0.5) & (y < 0.5)` is roughly equivalent to 3 intermediate steps `tmp1 = (x > 0.5); tmp2 = (y < 0.5); mask = tmp1 & tmp2`
  - `eval()`: used for computation
    - Comes in 2 flavour: `pd.eval()` & `df.eval()`
    - Local variable can be used inside `eval()` by preceding variable name with `@`
  - `query()`: used for filtering operation
    - comes in 1 flavour: `df.query()`
    - Similar to `eval()`, local variable can be used by preceding variable name with `@`

## Pandas Object - Series

| Value type | Index declaration scenario                                             | Equivalent Series object                                               |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Scalar     | `pd.Series(5, index=[100, 200, 300])`                                  | values as `[5, 5, 5]`                                                  |
| List       | `data = pd.Series([0.25, 0.5, 0.75, 1.0], index=['a', 'b', 'c', 'd'])` | default index as `range(0, size)`                                      |
| Dict       | `pd.Series({2:'a', 1:'b', 3:'c'})`                                     | index are sorted as `pd.Series(['b', 'c', 'a'], index=[1, 2, 3])`      |
| Dict       | `pd.Series({2:'a', 1:'b', 3:'c'}, index=[3, 2])`                       | populated only with the explicitly identified keys `values=['c', 'a']` |

| Data Indexing & Selection - Syntax  | Description                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `data.values`                       | get values. Type: `numpy.ndarray`                                                       |
| `data.unique()`                     | Return unique values. Type: `numpy.ndarray`                                             |
| `data.index`                        | get index. Index is an array-like object of type `pd.Index`                             |
| `data[<index>]`                     | **explicit** index when indexing. `data[1]` returns value with index (not position) `1` |
| `data[<index-int>:<index-int>]`     | **implicit** index when slicing. `data[1:3]` returns values at position `1` & `2`       |
| `data.loc[1]` or `data.loc[1:3]`    | indexer attribute. Always references the **explicit** index                             |
| `data.iloc[1]` or `data.iloc[1:3]`  | indexer attribute. Always references the **implicit** index                             |
| `data[(data > 0.3) & (data < 0.8)]` | masking                                                                                 |
| `data[['a', 'e']]`                  | fancy indexing                                                                          |

## Pandas Object - DataFrame

| Ways to create DataFrame object          | Syntax                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| dictionary of Series objects (preferred) | `pd.DataFrame({'population': population_series, 'area': area_series})`                |
| list of dicts                            | `pd.DataFrame([{'a': 1, 'b': 2}, {'b': 3, 'c': 4}])`. Missing values are marked `NaN` |
| 2D NumPy array                           | `pd.DataFrame(np.random.rand(3, 2), columns=['foo', 'bar'], index=['a', 'b', 'c'])`   |

| Syntax                        | Purpose                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| `df.index` (row-index)        | get/set row index. Index is an array-like object of type `pd.Index` |
| `df.columns` (column-index)   | get/set column names. Type `pd.Index`                               |
| `df.values`                   | get values. Type: `numpy.ndarray`                                   |
| `df.dtypes`, `df.index.dtype` | Returns data type of each column and row-index                      |
| `df.T`                        | Transpose. Swap rows & columns                                      |
| `df.head()`/`df.tail()`       | display top/bottom entries                                          |
| `df.describe()`               | computes several common aggregates for each column                  |
| `df.info()`                   | prints summary of a DataFrame                                       |

| Indexing & Slicing - syntax                           | Purpose                                                                                |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `df[<column-name>]` (Indexing)                        | Access Series of column data                                                           |
| `df[index:index]` (Slicing)                           | Return rows. Type: `DataFrame`                                                         |
| `df.iloc[:3, :2]` or `df.loc[:'Illinois', :'pop']`    | indexer attribute. `(i)loc[row, column]`. If 'column' is missing, consider all columns |
| `data.loc[data["density"] > 100, ["pop", "density"]]` | masking & fancy indexing                                                               |

## Operating on Data

| Syntax                                            | Explain                                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `np.square(<ser_or_df>)`                          | any NumPy uFunc will work on Pandas Series and DataFrame objects                    |
| `pop_ser_or_df / area_ser_or_df`                  | resulting array contains the union of indices. A missing value is marked with `NaN` |
| `A.add(B, fill_value=0)`                          | fill missing value. Default: `NaN` (floating type)                                  |
| `df - df.iloc[0]` or `df.sub(row_series, axis=1)` | Operation b/w df & series. Operate **row-wise (Default)**                           |
| `df.subtract(df['R'], axis=0)`                    | Operation b/w df & series. Operate column-wise                                      |
| `df.mean(axis=1)`                                 | aggregate within each row. Column axis is collapsed                                 |
| `df.<operation>(inplace=True)`                    | modify the object **in place** (do not create a new object)                         |

## Null Values

| Syntax           | Description                                       |
| ---------------- | ------------------------------------------------- |
| `data.isnull()`  | Generate a Boolean mask indicating missing values |
| `data.notnull()` | Opposite of `isnull()`                            |
| `data.dropna()`  | Removes NA values                                 |
| `data.fillna()`  | Fills in NA values                                |

| DataFrame Scenario - Syntax                        | Explain                                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `df.dropna()`                                      | Drop rows (default behavior) having any `null` value                                                              |
| `df.dropna(axis='columns')` or `df.dropna(axis=1)` | Drop columns having any `null` value. NOTE: **no collapse analogy**                                               |
| `df.dropna(how='all')`                             | Drop rows having ALL `null` values. Default: `how='any'`                                                          |
| `df.dropna(thresh=3)`                              | Drop rows having NON-NULL values less than threshold.                                                             |
| `data.fillna(5)`                                   | fill NA entries with a single value                                                                               |
| `df.fillna(method='ffill', axis=0)`                | forward-fill to propagate previous value forward. Use value of previous row, same column. Skip if no previous row |
| `df.fillna(method='bfill', axis=0)`                | back-fill to propagate next value backward. Use value of next row, same column. Skip if no next row               |

## Hierarchical/Multi Indexing

| Syntax                                                                    | Description                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `index = pd.MultiIndex.from_tuples([('a',1), ('a',2), ('b',1), ('b',2)])` | multi-index from the tuples                                                                 |
| `index = pd.MultiIndex.from_arrays([['a', 'a', 'b', 'b'], [1, 2, 1, 2]])` | multi-index from 2 or more index array                                                      |
| `index = pd.MultiIndex.from_product([['a', 'b'], [1, 2]])` (Preferred)    | multi-index from Cartesian product of single indices                                        |
| `ser[:, 1]`                                                               | access all data for which the second index is `1`                                           |
| `ser.unstack(level=-1)`                                                   | Series with MultiIndex produces DataFrame. `level` : int, str, or list. Default: last level |
| `df.stack()`                                                              | opposite of `unstack`. Returns `Series`                                                     |
| `ser_or_df.index.names = ['state', 'year']` or `pd.MultiIndex.*(names=)`  | multi-index level names                                                                     |
| `ser_or_df.sort_index()`                                                  | sort object by index labels                                                                 |
| `ser_or_df.reset_index()`                                                 | turn the index labels into columns. Set `name` param for the original Series values         |
| `ser_or_df.set_index(['col_1', 'col_2'])`                                 | opposite of `reset_index`. return multi-indexed data                                        |

| Indexing & Slicing - 2 level Series | Description                                          |
| ----------------------------------- | ---------------------------------------------------- |
| `ser[level_1_index, level_2_index]` | Access single item in 2 level series                 |
| `ser[level_1_index]`                | Partial indexing                                     |
| `ser[level_1_index:level_1_index]`  | Partial slicing as long as Multi-index is **sorted** |
| `ser[:, level_2_index]`             | Access series with `(*, level_2_index)` key          |
| `ser[ser > 22000000]`               | masking                                              |
| `ser[['California', 'Texas']]`      | fancy indexing                                       |

| DataFrame - 2 level col & 2 level index | Description                               |
| --------------------------------------- | ----------------------------------------- |
| `df['col_lev_1', 'col_lev_2']`          | Returns Series                            |
| `df.loc[:, ('col_lev_1', 'col_lev_2')]` | Returns Series                            |
| `df.iloc[:2, :2]`                       | Returns first-2-row & first-2-column grid |

## Combining Dataset - Concat

| Syntax                                  | Description                                                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pd.concat([df1, df2])`                 | By default, row-wise concatenation. `axis=0`                                                                   |
| `pd.concat([df1, df2], axis="columns")` | column-wise concatenation. `axis=1`                                                                            |
| `pd.concat(..., verify_integrity=True)` | concatenation will raise an exception if there are duplicate indices                                           |
| `pd.concat(..., ignore_index=True)`     | Original index are ignored. Result index: `range(0, size)`                                                     |
| `pd.concat(..., keys=['x', 'y'])`       | Construct hierarchical index using the passed keys as the outermost level. `df1` with label `x`                |
| `pd.concat(..., join='inner')`          | final column set is intersection of input columns. By default, join is a union of input columns `join='outer'` |
| `df1.append(df2)` (AVOID IT)            | Same as `pd.concat([df1, df2])`. Not an efficient method                                                       |

## Combining Dataset - Merge (Join DB)

| Syntax                                                                     | Explanation                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `pd.merge(df1, df2, on='<common-column>')`                                 | explicitly specify the name of the key column. Takes single or list of column names  |
| `pd.merge(df1, df2, left_on="col_1", right_on="col_2")`                    | merge two datasets with different column names                                       |
| `pd.merge(df1, df2, left_index=True, right_index=True)` or `df1.join(df2)` | use df1 & df2 indices as the key for merging                                         |
| `pd.merge(df1a, df3, left_index=True, right_on='name')`                    | mixing indices and columns                                                           |
| `pd.merge(df1, df2, how='<type_of_merge>')`                                | Similar to SQL joins. Values: left, right, outer, inner, cross. Default: inner       |
| `pd.merge(df8, df9, on="name", suffixes=["_L", "_R"])`                     | Suffixes for the overlapping column names (other than key column). Default: `_x, _y` |

## Grouping

| Option to specify split key                                                | Syntax                                                            |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Any series or list with a length matching that of df                       | `df.groupby(df['key'])` or `df.groupby([0,0,0,1,0,1,1....])`      |
| A dict that maps index values to the group keys                            | `df2.groupby({'A': 'vowel', 'B': 'consonant', 'C': 'consonant'})` |
| Similar to mapping, pass func that will input index value and output group | `df2.groupby(str.lower)`                                          |
| Multi-index grouping                                                       | `df2.groupby([str.lower, mapping])`                               |

| Syntax                                                                  | Description                                                          |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `df.groupby("key").sum()`                                               | Aggregation. Returns summation column-wise for each group            |
| `df.groupby('key').aggregate(['min', np.median, max])`                  | Aggregation. Return multi-index column `(col-name, agg-item)`        |
| `df.groupby("key").aggregate({"col1": "min", "col2": "max"})`           | Aggregation. Different aggregation for different column              |
| `df.groupby("key").filter(lambda grp: grp["col2"].min() > 2)`           | Filter based on group properties. `filter(group: DataFrame) -> bool` |
| `df.groupby('key').transform(lambda grp_col: grp_col - grp_col.mean())` | Transform column-wise per group                                      |
| `df.groupby("key").apply(lambda grp: grp["data1"] / 2)`                 | Apply any func to grouping df (AVOID IT)                             |

| Transform                                                                | Apply                                                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `transform(grp_col: Series) -> Series`                                   | `apply(grp: DataFrame) -> df or series or scalar`                      |
| `transform()` passes each column for each group individually as a Series | `apply()` passes all the columns for each group as a df                |
| `df.groupby().transform` returns same shape as the original df           | `df.groupby().apply` returns df/ser with extra outer multi-index `key` |
| Good performance                                                         | Bad Performance. Last option                                           |

## Pivot Tables

| Type           | Syntax                                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| basic          | `titanic.pivot_table("survived", index="sex", columns="class")`. Group by class and gender, select survival, apply a mean (default) aggregate |
| multilevel     | `titanic.pivot_table('survived', ['sex', age_dis_ctg], [fare_dis_ctg, 'class'])`. Use `pd.cut` or `pd.qcut` for discrete category (dis_ctg)   |
| aggregate      | `titanic.pivot_table(index='sex', columns='class', aggfunc={'survived':sum, 'fare':'mean'})`                                                  |
| compute totals | `titanic.pivot_table(..., margins=True, margins_name='All')`                                                                                  |

## Vectorized String Operations

| Syntax                                        | Usage                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `series.str.capitalize()`                     | Convert strings in the Series/Index to be capitalized. Returns series of strings    |
| `series.str.startswith('T')`                  | Returns series of boolean values                                                    |
| `series.str.split()`                          | Returns series of array-of-string                                                   |
| `series.str.findall(r'^[^AEIOU].*[^aeiou]$')` | methods accepting regular expressions to examine the content of each string element |
| `series.str.slice(0,3)` or `series.str[0:3]`  | Slicing each string element                                                         |
| `series.str.get(3)` or `series.str[3]`        | Indexing each string element                                                        |
| `series.str.split().str.get(-1)`              | Complex Example - extract the last name of each entry                               |

## Pandas Time Series

```py title="numpy datetime64"
# `datetime64` dtype encodes dates as 64-bit integers
# it imposes a trade-off between time resolution and maximum time span
# e.g. if you want a time resolution of one nanosecond, you only have enough information to encode a range of 2^64 nanoseconds, or just under 600 years
np.datetime64("2015-07-04") # implicitly day-based (frequency) datetime. dtype: datetime64[D]
np.datetime64("2015-07-04 12:00") # implicitly minute-based datetime. dtype: datetime64[m]
np.datetime64("2015-07-04 12:00", "ns") # explicitly nanosecond-based datetime. dtype: datetime64[ns]

# ===== Create
# it requires a very specific input format
date = np.array(["2026-02-28"], dtype=np.datetime64) # dtype: datetime64[D]. By default, frequency=Day

# ===== Vectorized operation
date + np.arange(3) # array(['2026-02-28', '2026-03-01', '2026-03-02'], dtype='datetime64[D]')
```

| time stamps                                     | time periods                                   | time deltas                                      |
| ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| represents a specific point in time             | represents a span/interval of time             | represents a length of time                      |
| `pd.Timestamp` type based on `numpy.datetime64` | `pd.Period` type based on `numpy.datetime64`   | `pd.Timedelta` type based on `numpy.timedelta64` |
| associated index: `DatetimeIndex`               | associated index: `PeriodIndex`                | associated index: `TimedeltaIndex`               |
| Usage: Precise logs, stock trade tracking       | Usage: monthly aggregations, quarterly targets | Usage: Calculating elapsed time, countdowns      |
| Ex: "2026-09-22 14:30:00"                       | Ex: "2026-09" (the entire month of September)  | Ex: "5 days 02:00:00"                            |

```py title="DatetimeIndex"
# Pandas time series tools really become useful is when you begin to index data by timestamps
# ===== Create
index = pd.DatetimeIndex(["2014-07-04", "2014-08-04", "2015-07-04", "2015-08-04"])

# ===== Attributes of DatetimeIndex
index.dayofweek # Index([4, 0, 5, 1], dtype='int32')
index.month # Index([7, 8, 7, 8], dtype='int32')
index.month_name() # Index(['July', 'August', 'July', 'August'], dtype='object')

# ===== Indexing & Slicing of Pandas object
ser_or_df['2014-07-04':'2015-07-04']
ser_or_df['2015'] # pass a year to obtain a slice of all data from that year
```

```py title="interchange time series types"
# Passing a single date to pd.to_datetime() yields a Timestamp; passing a series of dates by default yields a DatetimeIndex
dates = pd.to_datetime([datetime(2015, 7, 3), "4th of July, 2015", "2015-Jul-6", "07-07-2015", "20150708"])  # DatetimeIndex(['2015-07-03', ...], dtype='datetime64[ns]', freq=None)

# PeriodIndex
per = dates.to_period("D")  # D -> day (frequency). PeriodIndex(['2015-07-03', ...], dtype='period[D]')
per.to_timestamp(how='start') # Period to Timestamp

# Time delta
dates - dates[0]  # TimedeltaIndex(['0 days', ...], dtype='timedelta64[ns]', freq=None)
```

```py title='operation'
# ===== Resampling
tseries.resample("Y").mean() # reports the average of the previous year. It is fundamentally a data aggregation
tseries.asfreq("Y") # reports the value at the end of the year. It is fundamentally a data selection

# ===== Shifting
tseries.shift(1) # shifts the data forward which means first item becomes `NaN`

# ===== Rolling/Windowing
tseries.rolling(3).sum() # pandas takes the first three data points, computes sum, and assigns that value to the third data point. First 2 are `NaN`
...rolling(3, center=True) # For a point at index i, the window includes: point before it (i-1), current point (i), point after it (i+1)
```

## High-Performance Pandas: eval() and query()

| level/scope                                           | eval syntax                                | regular syntax                            |
| ----------------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| top-level: obj attr & index                           | `result2 = pd.eval('df1.A + df2.T[0]')`    | `result1 = df1['A'] + df2.T[0]`           |
| df-level: column referred as variable                 | `result2 = df.eval('(A + B) / C')`         | `result1 = (df['A'] + df['B']) / df['C']` |
| df-level: assignment                                  | `df.eval('D = (A + B) / C', inplace=True)` |                                           |
| df-level: local variable (NOT supported by `pd.eval`) | `df.eval('A + @var_name')`                 |                                           |

| type                 | query syntax                                | regular syntax                              |
| -------------------- | ------------------------------------------- | ------------------------------------------- |
| basic filtering      | `result2 = df.query('A < 0.5 and B < 0.5')` | `result1 = df[(df.A < 0.5) & (df.B < 0.5)]` |
| using local variable | `df.query('A < @Cmean and B < @Cmean')`     | `df[(df.A < Cmean) & (df.B < Cmean)]`       |

## Misc

| Syntax                              | Usage                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pd.read_csv()`                     | read CSV file. Important parameters: `converters`                                                                        |
| `pd.read_json()`                    | read JSON file                                                                                                           |
| `pd.cut(series, bins=[0, 18, 80])`  | Create `(0, 18] & (18, 80]` bins. Useful for going from a continuous variable to a categorical variable                  |
| `pd.qcut(titanic["fare"], q=4)`     | Quantile-based discretization. It divides data into bins that each contain approximately the same number of observations |
| `pd.Series([1, 0, 3]).astype(bool)` | Convert Series to `bool` dtype                                                                                           |
| `pd.plot(kind=<plot-type>, ax=)`    | Create plot. e.g. `df.plot(ax=ax, kind="scatter", x="x", y="y")`                                                         |
