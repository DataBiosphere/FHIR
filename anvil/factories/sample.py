from anvil.terra.sample import Sample

class SampleJsonFactory():
    @staticmethod
    def sample_json(sample):
        return {
            'id': sample.id,
            'subjectId': sample.subject_id,
            'attributes': sample.attributes
        }