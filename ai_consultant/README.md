# AI Consultant

## Install dependencies

1. Do the following before installing the dependencies found in `requirements.txt` file because of current challenges installing `onnxruntime` through `pip install onnxruntime`. 

    - For MacOS users, a workaround is to first install `onnxruntime` dependency for `chromadb` using:

    ```python
     conda install onnxruntime -c conda-forge
    ```
    See this [thread](https://github.com/microsoft/onnxruntime/issues/11037) for additonal help if needed. 

     - For Windows users, follow the guide [here](https://github.com/bycloudai/InstallVSBuildToolsWindows?tab=readme-ov-file) to install the Microsoft C++ Build Tools. Be sure to follow through to the last step to set the enviroment variable path.


2. Now run this command to install dependenies in the `requirements.txt` file. 

```python
pip install -r requirements.txt
```

3. Install markdown depenendies with: 

```python
pip install "unstructured[md]"
```

## Data

Download data here and put in this directory.
https://polybox.ethz.ch/index.php/s/F4YCz1bvSGIwywn


## Quick Start

Create the Chroma DB.

```python
python create_database.py
```

Run an infinite chat instance (abort by entering "exit" or "quit").

```python
python run_chat.py 
```

> You'll also need to set up an OpenAI account and create a .env file with your API key (OPENAI_API_KEY="XXX").


