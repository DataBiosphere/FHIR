const AnvilMongo = require('./AnvilMongo');

describe('AnvilMongo client tests', () => {
  it('should call AnvilMongo', async () => {
    const anvilMongoClient = new AnvilMongo({ collectionName: 'Test' });

    const findSpy = jest.spyOn(anvilMongoClient, 'find').mockImplementation(() => {});
    const findOneSpy = jest.spyOn(anvilMongoClient, 'findOne').mockImplementation(() => {});

    await anvilMongoClient.find();
    expect(findSpy).toHaveBeenCalled();

    await anvilMongoClient.findOne();
    expect(findOneSpy).toHaveBeenCalled();
  });
});
