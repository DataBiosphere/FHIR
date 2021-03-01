from anvil.terra.sample import Sample
from factories import cleanupKeys
from pymongo import ReplaceOne

class SampleJsonFactory():
    @staticmethod
    def sample_json(sample, workspace_name):
        return {
            'id': sample.id.replace('/', '-'),
            'subjectName': sample.subject_id,
            'name': sample.attributes.name,
            'workspaceName': workspace_name,
            **cleanupKeys(sample.attributes.copy().pop('attributes', {}))
        }
    
    @staticmethod
    def bulk_replace_obj(sample, workspace_name):
        return ReplaceOne({ 'id': sample.id.replace('/', '-') }, SampleJsonFactory.sample_json(sample, workspace_name), upsert=True)