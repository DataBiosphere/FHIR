let error = true;

db.createCollection('workspace');

db.workspace.createIndex({
    "name": 1
}, {
    name: "idx_workspace_name",
    unique: true
});

