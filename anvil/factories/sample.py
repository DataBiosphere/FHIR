from anvil.terra.sample import Sample
from factories import cleanupKeys

class SampleJsonFactory():
    @staticmethod
    def sample_json(sample):
        return {
            'id': sample.id,
            'subjectId': sample.subject_id,
            'name': sample.attributes.name,
            **cleanupKeys(sample.attributes.copy().pop('attributes', {}))
        }