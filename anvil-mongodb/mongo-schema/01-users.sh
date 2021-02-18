#!/usr/bin/env bash
set -e

mongo <<EOF
use anvil
db.createUser(
    {
      user: 'anvil-read',
      pwd: '$ANVIL_READ_PASSWORD',
      roles:
        [
          { role: "read", db: "anvil" }
        ]
    }
)

db.createUser(
    {
      user: 'anvil-rw',
      pwd: '$ANVIL_RW_PASSWORD',
      roles:
        [
          { role: 'readWrite', db: 'anvil' }
        ]
    }
)
EOF