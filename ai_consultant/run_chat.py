import argparse
# from dataclasses import dataclass
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
import openai

# Load environment variables. Assumes that project contains .env file with API keys
load_dotenv()
#---- Set OpenAI API key 
# Change environment variable name from "OPENAI_API_KEY" to the name given in 
# your .env file.
openai.api_key = os.environ['OPENAI_API_KEY']


CHROMA_PATH = "chroma"

PROMPT_TEMPLATE1 = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

PROMPT_TEMPLATE = """
You are an experienced startup consultant helping early-stage businesses make strategic decisions. You are talking to a user who potentially is in this position and is looking for advice. 
Your task is to analyze the user's problem, extract relevant consulting principles from case studies, and apply them to the user's specific problem. 
Do NOT directly recite content from the context, but apply the patterns and concepts from the context to the user's specific problem.
If sensible, create a solution-oriented approach and structure it for clear understanding and easy-to-follow implementation.

## ---User Problem---:

{question}  

## ---Relevant Case Studies & Insights---:

{context}  

"""


def main():
    # Create CLI.
    #parser = argparse.ArgumentParser()
    #parser.add_argument("query_text", type=str, help="The query text.")
    #args = parser.parse_args()
    #query_text = args.query_text

    # Prepare the DB.
    embedding_function = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    #model = ChatOpenAI()
    
    memory = ConversationBufferMemory()
    chat = ConversationChain(
        llm=ChatOpenAI(),
        memory=memory
    )

    while True:
        query_text = input("You: ")
        if query_text.lower() in ["exit", "quit"]:
            break

        # Search the DB.

        past_chat = memory.load_memory_variables({})["history"]  # Get conversation history from memory

        results = db.similarity_search_with_relevance_scores(past_chat + query_text, k=3)
        if len(results) == 0:
            print(f"Unable to find any matching results.")
            break
        if results[0][1] < 0.7:
            print(f"Not enough relevant results found.")
            break

        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)
        print(prompt)

        #response_text = model.predict(prompt)
        response = chat.invoke(prompt)
        response_text = response["response"]

        #sources = [doc.metadata.get("source", None) for doc, _score in results]
        #formatted_response = f"Response: {response_text}\nSources: {sources}"
        formatted_response = f"Response: {response_text}"
        print("\n\n", formatted_response)
        #print("\n\n\n", sources)


if __name__ == "__main__":
    main()
