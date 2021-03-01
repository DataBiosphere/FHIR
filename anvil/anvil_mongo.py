from pymongo import MongoClient
import os

class AnvilDataAdapter():
    def __init__(self):
        self.connection_string = os.environ.get("MONGO_CONNECTION_STRING")

    def __enter__(self):
        self.client = MongoClient(self.connection_string)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close()

    def queryWrapper(self, callback=None):
        db = self.client.anvil

        try:
            return callback(db)
        except Exception as e:
            print(e)
            return None

    def close(self):
        self.client.close()
    
    def find(self, collection_name, query={}):
        return self.queryWrapper(lambda db: 
            db[collection_name].find(query)
        )

    def find_one(self, collection_name, query={}):
        return self.queryWrapper(lambda db: 
            db[collection_name].find_one(query)
        )
    
    def insert_many(self, collection_name, insert_arr):
        return self.queryWrapper(lambda db:
            db[collection_name].insert(insert_arr)
        )
    
    def replace_one(self, collection_name, filter_obj, new_obj):
        return self.queryWrapper(lambda db:
            db[collection_name].replace_one(filter_obj, new_obj, True)
        )
    
    def bulk_write(self, collection_name, replace_arr):
        return self.queryWrapper(lambda db:
            db[collection_name].bulk_write(replace_arr)
        )
        