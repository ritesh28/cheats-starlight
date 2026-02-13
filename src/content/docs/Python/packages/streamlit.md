---
title: Streamlit
---

![PyTorch Image](./streamlit.drawio.svg)

```bash title="Run Streamlit"
streamlit run your_script.py [-- script args] # When passing your script some custom arguments, they must be passed after two dashes. Otherwise the arguments get interpreted as arguments to Streamlit itself.
```

```py title="Server Client Flow"
##### THIS CODE RUNS ON THE SERVER #####
import streamlit as st, requests
drinks=requests.get(f'https://thecocktaildb.com/api/json/v1/1/list.php?i=list').json()
ingredients=[]
for drink in drinks['drinks']:
  ingredients.append(drink['strIngredient1'])
##### THIS CODE RUNS IN THE BROWSER #####
st.title('The Cocktail DB API')
st.markdown('---')
selected=st.selectbox('Select an Ingredient', ingredients)
st.markdown('---')
if selected:
  st.header(f'Drinks with {selected}')
##### THIS CODE RUNS ON THE SERVER #####
r=requests.get(f'https://thecocktaildb.com/api/json/v1/1/filter.php?i={selected}').json()
for drink in r['drinks']:
  ##### THIS CODE RUNS IN THE BROWSER #####
  st.subheader(drink['strDrink'])
  st.image(drink['strDrinkThumb'])
```

```py title="Session State"
if 'total' not in st.session_state:
  st.session_state.total=0
  # st.session_state['total']=0 # synonymous with the line above
if st.button('+'):
  st.session_state.total+=1
  st.write(st.session_state.total)
```

```py title="Callback"
def go_to_step2(name):
  st.session_state.info["name"] = name
  st.session_state.step = 2

# callback happens first, then rerun
st.button('Next', on_click=go_to_step2, args=(name,))
```

## Caching

| `st.cache_data`                                                                     | `st.cache_resource`                                                                      |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| recommended way to cache computations that return data                              | recommended way to cache global resources like ML models or database connections         |
| use when a function returns a serializable object (e.g. str, DataFrame, dict, list) | use when a function returns unserializable objects                                       |
| creates a new copy of the data at each function call                                | returns the cached object itself. Any mutation will exist across all reruns and sessions |

```py title='Cache'
@st.cache_data
def long_running_function(param1, param2):
    return …
```

## Fragments

```py title='Fragment Flow'
# full script will run top to bottom on your app's initial load

@st.fragment() # Fragment function
def toggle_and_text():
    cols = st.columns(2)
    cols[0].toggle("Toggle")
    # If you flip the toggle button in your running app, toggle_and_text() fragment will rerun, redrawing the toggle and text area while leaving everything else unchanged.
    cols[1].text_area("Enter text")

@st.fragment()
def filter_and_file():
    cols = st.columns(2)
    cols[0].checkbox("Filter")
    cols[1].file_uploader("Upload image")

toggle_and_text()
cols = st.columns(2)
cols[0].selectbox("Select", [1,2,3], None)
cols[1].button("Update") # if you click the update button, the full script will rerun, and Streamlit will redraw everything
filter_and_file()
```

```py title='Automate fragment reruns'
@st.fragment(run_every="10s")
def auto_function():
		# This will update every 10 seconds!
		df = get_latest_updates()
		st.line_chart(df)

auto_function()
```

## Multi Pages

```py title="Page Navigation Method"
import streamlit as st

# Define the pages
main_page = st.Page("main_page.py", title="Main Page", icon="🎈")
page_2 = st.Page("page_2.py", title="Page 2", icon="❄️")
page_3 = st.Page("page_3.py", title="Page 3", icon="🎉")

# Set up navigation
nav_page = st.navigation([main_page, page_2, page_3])

# Run the selected page
nav_page.run()
```

```md title="Pages Directory Method"
1. create python page inside `pages` directory
2. create `Home.py` in root directory
3. run `streamlit run Home.py`
4. config each page - `st.set_page_config(page_title='New Page')`
5. to switch pages programmatically: `st.switch_page()`
```

## Display & Style data Widgets

- `st.write`: called 'magic' widget since it can write based on the type of variable being written
- `st.title`, `st.header`, `st.subheader`, `st.caption`: Font size
- `st.code`, `st.markdown`, `st.metric`, `st.json`, `st.progress`
- `st.error`, `st.warning`, `st.info`, `st.success`, `st.exception(RuntimeError("This is a fake error."))`
- `st.dataframe`, `st.table`
- `st.image`: can be path or blob data
- `st.line_chart`, `st.map`, `st.pyplot`

## Interactive Widgets

- `st.button`
- `st.text_input`: any time the user interacts with the st.text_input() widget, the entire script is re-run,using that new variable value assigned to the widget's text contents
- `st.selectbox`, `st.multiselect`
- `st.checkbox`, `st.radio`
- `st.download_button`, `st.file_uploader`
- `st.form`: rerun only when submit button is clicked. `st.form_submit_button` is mandatory

```py title='Form'
# The variable values in a form are not evaluated until the st.form_submit_button() widget is clicked. At that point, the entire script is re-run using those input values
# Each form should have a unique name
with st.form('My Form', clear_on_submit=True):
  name=st.text_input('Name')
  mrkdwn=st.text_area('Markdown', '## Subheader\n- item 1\n- item 2')
  file=st.file_uploader('Image', ['png', 'jpg', 'gif', 'bmp'])
  if st.form_submit_button('Submit'):
    st.markdown(f'# {name}\n{mrkdwn}')
    st.image(file)
```

## Layout Widgets

- `st.sidebar.*`
- `col1, col2 = st.columns([1, 2])`: Creates horizontal sizes of ration 1:2. Can use `with col1:` or `col1.*`
- `tab1, tab2 = st.tabs(["TAB 1", "TAB 2"])`
- `st.expander`: expand-collapse component
- `st.container`:
  - Insert a multi-element container
  - Allows inserting multiple elements out of order
  - Use 'with' notation (preferred) or just call commands directly on the returned object
- `st.empty`:
  - Insert a single-element container
  - To insert/replace/clear an element on the returned container, you can use with notation or just call methods directly on the returned object
  - Use `st.container` inside `st.empty` to display (and later replace) a group of elements

## Special Widgets

- `st.spinner`
- `st.balloons`, `st.snow`
- `st.rerun`: manually rerun the application. has a scope of 'app' (to rerun whole app) or 'fragment' (to rerun the fragment)

## Other Codes

```py title='CRUD Database app'
import ast
import sqlite3

import streamlit as st

con = sqlite3.connect("db.db")
cur = con.cursor()
cur.execute(
    "CREATE TABLE IF NOT EXISTS db(name TEXT, letters TEXT, note TEXT, img BLOB)"
)

if st.button("Add New Row"):
    cur.execute(
        "INSERT INTO db(name, letters, note, img) VALUES(?,?,?,?)", ("", "[]", "", "")
    )
    con.commit()

for row in cur.execute("SELECT rowid, name, letters, note, img FROM db ORDER BY name"):
    with st.expander(row[1]):
        with st.form(f"ID-{row[0]}"):
            name = st.text_input("Name", row[1])
            letters = st.multiselect(
                "Letters",
                ["A", "B", "C"],
                ast.literal_eval(row[2]),  # deserialize: string to list
            )
            note = st.text_area("Note", row[3])
            if row[4]:
                img = row[4]
                st.image(row[4])
            file = st.file_uploader("Image", ["png", "jpg", "gif", "bmp"])
            if file:
                img = file.read()
            if st.form_submit_button("Save"):
                cur.execute(
                    "UPDATE db SET name=?, letters=?, note=?, img=? WHERE rowid=?;",
                    (
                        name,
                        str(letters),
                        note,
                        img,
                        row[0],
                    ),  # serialize: list to string
                )
                con.commit()
                st.rerun()
            if st.form_submit_button("Delete"):
                cur.execute(f'DELETE FROM db WHERE rowid="{row[0]}";')
                con.commit()
                st.rerun()
```

```py title='Calendar Database app'
import datetime
import sqlite3

import streamlit as st

con = sqlite3.connect("calendar.db")
cur = con.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS cal(date DATE, time TEXT, event TEXT)")

if st.button("Add New Event"):
    cur.execute(
        """
    INSERT INTO cal(date, time, event) VALUES(?,?,?)
    """,
        (datetime.date.today(), str(datetime.datetime.now().time()), ""),
    )
    con.commit()
    st.write("Added to current calendar day/time")

selected_date = st.date_input("Date to View", label_visibility="hidden")
if selected_date:
    for row in cur.execute(
        f"""
    SELECT rowid, date, time, event
    FROM cal
    WHERE date = '{str(selected_date)}'
    ORDER BY time
    """
    ):
        with st.expander(f"{row[2][:-6]} - {row[3]}"):
            with st.form(f"ID-{row[0]}"):
                date = st.date_input(
                    "Date", datetime.datetime.strptime(row[1], "%Y-%m-%d").date()
                )
                time = st.time_input(
                    "Time", datetime.datetime.strptime(row[2], "%H:%M:%S.%f").time()
                )
                event = st.text_area("Event", row[3])

                if st.form_submit_button("Save"):
                    cur.execute(
                        "UPDATE cal SET date=?, time=?, event=? WHERE date=? and time=?;",
                        (date, str(time) + ".00", event, row[1], row[2]),
                    )
                    con.commit()
                    st.rerun()
                if st.form_submit_button("Delete"):
                    cur.execute(f'DELETE FROM cal WHERE rowid="{row[0]}";')
                    con.commit()
                    st.rerun()
```

```py title='Dataframe Grid'
import sqlite3

import pandas as pd
import streamlit as st

con = sqlite3.connect("db.db")
cur = con.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS db(name TEXT, letters TEXT, note TEXT)")
st.header("Read")

if st.checkbox("Recheck to refresh display", value=True):
    my_rows = [
        list(row)
        for row in cur.execute(
            """
    SELECT rowid, name, letters, note
    FROM db
    ORDER BY name
    """
        )
    ]

    st.dataframe(
        pd.DataFrame(my_rows, columns=["rowid", "name", "letters", "note"]), height=800
    )
```

```py title='Dynamic Text Input Generator'
num_inputs = st.number_input(
    "Number of text inputs", min_value=0, max_value=10, value=0, step=1
)

if num_inputs > 0:
    with st.form("dynamic_form"):
        text_values = []
        for i in range(int(num_inputs)):
            text_input = st.text_input(f"Text input {i + 1}", key=f"text_{i}")
            text_values.append(text_input)

        if st.form_submit_button("Submit"):
            CONCATENATED_RESULT = " ".join(text_values)
            st.success(f"Concatenated result: {CONCATENATED_RESULT}")
```
