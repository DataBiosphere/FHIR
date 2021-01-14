# AnVIL Project Broad FHIR Adapter

## Getting Started

1. Create a Virtual Environment

```
cd anvil
python3 -m venv .venv
```

2. Source it

```
source .venv/bin/activate
```

3. Install it

```
pip install -r requirments.txt
```

4. Configure it

```
echo GOOGLE_APPLICATION_CREDENTIALS=./creds.json > .env
```

5. Run it

```
python query.py
```
