let error = true;

db.createCollection('sample');

db.sample.createIndex({
    "id": 1
}, { 
    name: "idx_sample_id",
    unique: true
});