from anvil.terra.subject import Subject
from factories import cleanupKeys
from pymongo import ReplaceOne

class SubjectJsonFactory():
    @staticmethod
    def subject_json(subject, workspace_name):
        return {
            'id': subject.id.replace('/', '-'),
            'gender': subject.gender,
            'ethnicity': subject.ethnicity,
            'phenotypes': subject.phenotypes,
            'diseases': subject.diseases,
            'name': subject.attributes.name,
            'workspaceName': workspace_name,
            **cleanupKeys(subject.attributes.copy().pop('attributes', {}))
        }
    
    @staticmethod
    def bulk_replace_obj(subject, workspace_name):
        return ReplaceOne({ 'id': subject.id.replace('/', '-') }, SubjectJsonFactory.subject_json(subject, workspace_name), upsert=True)