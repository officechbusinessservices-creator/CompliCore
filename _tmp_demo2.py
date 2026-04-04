import os
import asyncio
from functools import partial
from lightrag import LightRAG, QueryParam
from lightrag.llm.ollama import ollama_model_complete, ollama_embed
from lightrag.utils import EmbeddingFunc, setup_logger

setup_logger('lightrag', level='INFO')

WORKING_DIR = './rag_storage'
if not os.path.exists(WORKING_DIR):
    os.mkdir(WORKING_DIR)

async def initialize_rag():
    rag = LightRAG(
        working_dir=WORKING_DIR,
        llm_model_func=ollama_model_complete,
        llm_model_name='qwen2.5:3b',
        llm_model_kwargs={
            'host': 'http://localhost:11434',
            'options': {'num_ctx': 32768},
            'timeout': 600,
        },
        embedding_func=EmbeddingFunc(
            embedding_dim=768,
            max_token_size=8192,
            func=partial(
                ollama_embed.func,
                embed_model='nomic-embed-text',
                host='http://localhost:11434',
            ),
        ),
        max_async=2,
    )
    await rag.initialize_storages()
    return rag

async def main():
    rag = None
    try:
        rag = await initialize_rag()

        with open('book.txt', 'r') as f:
            text = f.read()
        print(f'Inserting {len(text)} characters...')
        await rag.ainsert(text)

        # Create query parameters
        query_param = QueryParam(
            mode='hybrid',
            user_prompt='For diagrams, use mermaid format with English/Pinyin node names and Chinese display labels',
        )

        # Query and process
        response = await rag.aquery(
            'Please draw a character relationship diagram for Scrooge',
            param=query_param,
        )
        print(response)

    except Exception as e:
        print(f'An error occurred: {e}')
    finally:
        if rag:
            await rag.finalize_storages()

if __name__ == '__main__':
    asyncio.run(main())
