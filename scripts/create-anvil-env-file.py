import os

file = open(".env", "w")

file.write("GOOGLE_APPLICATION_CREDENTIALS=./creds.json\n\
GOOGLE_PROJECT=broad-fhir-dev\n\
AVRO_PATH=./export_2020-11-04T17_48_47.avro")

file.close()