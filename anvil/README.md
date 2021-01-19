# AnVIL Project Broad FHIR Adapter

## Getting Started

1. Create a Virtual Environment

```
cd anvil
python3 -m venv .venv
```

2. Source your Virtual Environment

```
source .venv/bin/activate
```

3. Install it

```
pip install -r requirments.txt
```

4. Configure it

```
echo "GOOGLE_APPLICATION_CREDENTIALS=./creds.json\n\
GOOGLE_PROJECT=broad-fhir-dev\n\
AVRO_PATH=./export_2020-11-04T17_48_47.avro"\n\
 > .env
```

> If you don't have an AVRO export, make sure you export one from https://gen3.theanvil.io/

5. Run it

```
python main.py
```

Running the full script may take a few minutes. Your data will be located in "./data" by default.
