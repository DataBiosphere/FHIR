import os
import json

data = {
    "client_id" : os.getenv("CLIENT_ID"),
    "client_secret" : os.getenv("CLIENT_SECRET"),
    "quota_project_id" : os.getenv("QUOTA_PROJECT_ID"),
    "refresh_token" : os.getenv("REFRESH_TOKEN"),
    "type" : os.getenv("TYPE")
}

with open("creds.json", "w") as outfile:
    json.dump(data, outfile)