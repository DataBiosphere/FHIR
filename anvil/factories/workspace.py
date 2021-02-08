from anvil.terra.workspace import Workspace
from factories.sample import SampleJsonFactory
from factories.subject import SubjectJsonFactory

class WorkspaceJsonFactory():
    @staticmethod
    def workspace_json(workspace):
        return {
            'googleProject': 'anvil-datastorage',
            'name': workspace.name,
            'namespace': workspace.attributes.workspace.namespace,
            'attributes': workspace.attributes.workspace.attributes,
            'subjects': [SubjectJsonFactory.subject_json(s, workspace.samples) for s in workspace.subjects]
        }