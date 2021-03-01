let error = true;

db.createCollection('subject');

db.subject.createIndex({
    "id": 1
}, {
    name: "idx_subject_id",
    unique: true
});