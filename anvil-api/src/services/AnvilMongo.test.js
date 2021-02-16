const AnvilMongo = require('./AnvilMongo');

describe('AnvilMongo client tests', () => {
  it('should call AnvilMongo', async () => {
    const anvilMongoClient = new AnvilMongo({ collectionName: 'Test' });

    const querySpy = jest.spyOn(anvilMongoClient, 'findOne').mockImplementation(() => {});

    await anvilMongoClient.find({ query: {}, projection: {} });
    expect(querySpy).toHaveBeenCalled();
  });
});
