# AnVIL Project Broad FHIR Adapter

## Getting Started

Create a Virtual Environment.

```
cd anvil
python3 -m venv .venv
```

Source your Virtual Environment.

```
source .venv/bin/activate
```

Install.

```
pip install -r requirments.txt
```

Configure your project using the `.env.test` provided.

```
cp .env.test .env
```

Run.

```
python main.py
```

Running the full script may take a few minutes. Your data will be located in "./data" by default.

## [If you are having trouble, remember to configure the application correctly.](../docs/CONFIGURATION.md)
