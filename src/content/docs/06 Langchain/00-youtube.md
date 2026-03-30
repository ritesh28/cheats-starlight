---
title: LangChain Crash Course
---

## LangChain Ecosystem

- A set of tools designed to simplify the entire lifecycle of building, deploying, and monitoring applications powered by Large Language Models (LLMs)
- `pip install -U 'langchain[openai]'`: install or update the LangChain framework along with the optional dependencies required to use it with OpenAI

## Simple AI Agent Example

```py title='weather tool'
import requests
from langchain.agents import create_agent
from langchain.tools import tool


@tool(
    "get_weather",
    description="Return weather information for a given city",
    return_direct=False,
)
def get_weather(city: str):
    response = requests.get(f"https://wttr.in/{city}?format=j1")
    return response.json()


agent = create_agent(
    model="gpt-4.1-mini",  # not all llm supports passing tool
    # for this llm 'gpt' to work, should have installed langchain[openai] & should have env 'OPENAI_API_KEY'
    tools=[get_weather],
    system_prompt="You are a helpful weather assistant",
)
response = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "What is the wather like in Syndey, NSW?"}
        ]
    }
)
print(response["messages"][-1].content)
```

## Standalone Model Inference

```py title='single message'
from langchain.chat_models import init_chat_model

model = init_chat_model(
    model="gpt-4.1-mini",
    temperature=0.1,
)
response = model.invoke("What is python? Write in 10 words.")
print(response.content)
```

```py title='conversation'
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage, AIMessage, SystemMessage

# SystemMessage: Message for priming AI behavior. It is usually passed in as the first of a sequence of input messages
# AIMessage: is returned from a chat model as a response to a prompt
# HumanMessage: a message passed in from a user to the model

model = init_chat_model(
    model="gpt-4.1-mini",
    temperature=0.1,
)
conversation = [
    SystemMessage("You are a helpful assistant for questions regarding programming"),
    HumanMessage("What is Python?"),
    AIMessage("Python is an interpreted programming language for general-purpose."),
    HumanMessage("When was it released?"),
]
response = model.invoke(conversation)
print(response.content)
```

```py title='multi-modal input'
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-4.1-mini")

message = {
    "role": "user",
    "content": [
        {"type": "text", "text": "Describe the contents of this image in 10 words"},
        {
            "type": "image",
            "url": "https://www.shutterstock.com/image-vector/minsk-belarus-03272023-openai-chatgpt-260nw-2281899103.jpg",
        },
        # OR we can use a base64 encoder
        # {
        #     "type": "image",
        #     "base64": b64encode(open("img.png", "rb").read()).decode(),
        #     "mine_type": "image/png",
        # },
    ],
}
response = model.invoke([message])
print(response.content)
```

## Advanced Agent Example

```py title='context, memory & structured output'
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langgraph.checkpoint.memory import InMemorySaver
from dataclasses import dataclass
import requests


@dataclass
class Context:
    user_id: str


@dataclass
class ResponseFormat:
    summary: str
    temperature_celsius: float
    temperature_fahrenheit: float
    humidity: float


@tool(
    "get_weather",
    description="Return weather information for a given city",
    return_direct=False,
)
def get_weather(city: str):
    response = requests.get(f"https://wttr.in/{city}?format=j1")
    return response.json()


@tool("locate_user", description="Look up a user city based on the context")
def locate_user(runtime: ToolRuntime[Context]):
    match runtime.context.user_id:
        case "ABC123":
            return "Vienna"
        case "XYZ456":
            return "London"
        case "HJK111":
            return "Paris"
        case _:
            return "Unknown"


model = init_chat_model(model="gpt-4.1-mini", temperature=0.3)
checkpointer = InMemorySaver()

agent = create_agent(
    model=model,
    tools=[get_weather, locate_user],
    system_prompt="You are a helpful weather assistant",
    context_schema=Context,
    response_format=ResponseFormat,
    checkpointer=checkpointer,
)

config = {"configurable": {"thread_id": 1}}  # think thread as a memeory chain/space
response = agent.invoke(
    {
        "messages": [{"role": "user", "content": "What is the wather like?"}],
    },
    config=config,
    context=Context(user_id="HJK111"),
)
print(response["structured_response"])
```

```py title='RAG: Embeddings, Vector Stores, Retrieval'
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.tools import create_retriever_tool  # old way of doing things
from langchain.agents import create_agent

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
texts = [
    "Apple makes very good computers.",
    "I believe Apple is innovative!",
    "I love apples.",
    "I am a fan of MacBooks.",
    "I enjoy oranges.",
    "I like Lenovo Thinkpads.",
    "I think pears taste very good.",
]

vector_store = FAISS.from_texts(texts, embedding=embeddings)
# SIMILARITY SEARCH
# docs = vector_store.similarity_search("Apples are my favorite food", k=7)
# print([doc.page_content for doc in docs])

retriever = vector_store.as_retriever(search_kwargs={"k": 3})
retriever_tool = create_retriever_tool(
    retriever,
    name="kb_search",
    description="Search the product/fruit knowledge base for information",
)

agent = create_agent(
    model="gpt-4.1-mini",
    tools=[retriever_tool],
    system_prompt=(
        "You are a helpful assistant. For questions about Macs, apples, or laptops, "
        "first call the kb_search tool to retrieve context, then answer succinctly. Maybe you have to use it multiple times before answering."
    ),
)

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "What three fruits does the person like and what three frvits does the person dislike?",
            }
        ]
    }
)
print(result["messages"][-1].content)
# O/P => The person likes oranges, pears, and apples. There is no information about fruits that the person dislikes.
```

## Middleware

```py title='dynamic system prompts'
from dataclasses import dataclass
from langchain.agents.middleware import dynamic_prompt, ModelRequest
from langchain.agents import create_agent


@dataclass
class Context:
    user_role: str


@dynamic_prompt
def user_role_prompt(request: ModelRequest) -> str:
    user_role = request.runtime.context.user_role
    base_prompt = "You are a helpful and very concise assistant."
    match user_role:
        case "expert":
            return f"{base_prompt} Provide detail technical responses."
        case "beginner":
            return f"{base_prompt} Keep your explanations simple and basic."
        case "child":
            return f"{base_prompt} Explain everything as if you were literally talking to a five-year old."
        case _:
            return base_prompt


agent = create_agent(
    model="gpt-4.1-mini", middleware=[user_role_prompt], context_schema=Context
)

response = agent.invoke(
    {"messages": [{"role": "user", "content": "Explain PCA."}]},
    context=Context(user_role="child"),
)
print(response["messages"][-1].content)
```

```py title='dynamic model choice'
from langchain.messages import HumanMessage, SystemMessage
from langchain.chat_models import init_chat_model
from langchain.agents.middleware import ModelRequest, ModelResponse, wrap_model_call
from langchain.agents import create_agent


basic_model = init_chat_model(model="gpt-40-mini")
advanced_model = init_chat_model(model="gpt-4.1-mini")


@wrap_model_call
def dynamic_model_selection(request: ModelRequest, handler) -> ModelResponse:
    message_count = len(request.state["messages"])
    model = advanced_model if message_count > 3 else basic_model
    request.model = model
    return handler(request)


agent = create_agent(model=basic_model, middleware=[dynamic_model_selection])

response = agent.invoke(
    {
        "messages": [
            SystemMessage("You are a helful assistant"),
            HumanMessage("What is 1+1?"),
        ]
    },
)
print(response["messages"][-1].content)
print(response["messages"][-1].response_metadata['model_name'])
```

```py title='Custom Agent Middleware'
from time import time

from langchain.messages import HumanMessage, SystemMessage
from langchain.agents.middleware import AgentMiddleware, AgentState
from langchain.agents import create_agent


class HooksDemo(AgentMiddleware):
    def __init__(self):
        super().__init__()
        self.start_time = 0.0

    def before_agent(self, state: AgentState, runtime):
        self.start_time = time()
        print("before_agent triggered")

    def before_model(self, state: AgentState, runtime):
        print("before_model")

    def after_model(self, state: AgentState, runtime):
        print("after_model")

    def after_agent(self, state: AgentState, runtime):
        print("after_agent:", time() - self.start_time)


agent = create_agent(model="gpt-4.1-mini", middleware=[HooksDemo()])

response = agent.invoke(
    {
        "messages": [
            SystemMessage("You are a helful assistant"),
            HumanMessage("What is 1+1?"),
        ]
    },
)
print(response["messages"][-1].content)
# O/P =>
# before_agent triggered
# before_model
# after_model
# after_agent: 1.5595240592956543
# 1 + 1 equals 2.
```
