from anvil.terra.sample import Sample
from factories import cleanupKeys
from pymongo import ReplaceOne

class SampleJsonFactory():
    @staticmethod
    def sample_json(sample):
        return {
            'id': sample.id.replace('/', '|'),
            'subjectName': sample.subject_id,
            'name': sample.attributes.name,
            **cleanupKeys(sample.attributes.copy().pop('attributes', {}))
        }
    
    @staticmethod
    def bulk_replace_obj(sample):
        return ReplaceOne({ 'id': sample.id }, SampleJsonFactory.sample_json(sample), upsert=True)