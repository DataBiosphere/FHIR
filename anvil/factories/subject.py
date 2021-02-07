from anvil.terra.subject import Subject
from factories.sample import SampleJsonFactory

class SubjectJsonFactory():
    @staticmethod
    def subject_json(subject, samples):
        def find_samples(name):
            return samples[name]

        return {
            'id': subject.id,
            'gender': subject.gender,
            'ethnicity': subject.ethnicity,
            'samples': [SampleJsonFactory.sample_json(s) for s in find_samples(subject.attributes.name)]
        }