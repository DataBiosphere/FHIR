from anvil.terra.workspace import Workspace
from factories import cleanupKeys
from pymongo import ReplaceOne

class WorkspaceJsonFactory():
    @staticmethod
    def workspace_json(workspace):
        def remove_unwanted(attributes, value_func):
            new_dict = {}

            for k, v in attributes.items():
                    new_dict[k.replace('library:', '').replace('tag:', '')] = value_func(v)

            return new_dict
        
        def remove_attr_value(value):
            new_value = []

            try:
                if 'itemsType' in value and value['itemsType'] == 'AttributeValue':
                    new_value = value['items']
                else:
                    new_value = value
            except:
                new_value = value

            return new_value

        workspace_dict = {
            'name': workspace.name,
            **cleanupKeys(remove_unwanted(workspace.attributes.workspace.attributes, remove_attr_value))
        }
        return workspace_dict
    
    @staticmethod
    def bulk_replace_obj(workspace):
        return ReplaceOne({ 'name': workspace.name }, WorkspaceJsonFactory.workspace_json(workspace), upsert=True)