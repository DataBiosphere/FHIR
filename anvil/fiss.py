import firecloud.api as FAPI
import logging
import re
from attrdict import AttrDict

from dotenv import load_dotenv
load_dotenv()

print(FAPI.list_workspaces().json())
