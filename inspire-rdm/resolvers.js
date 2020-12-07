
module.exports = {
  Query: {
    conference: async (_, { id }, { dataSources }) => {
        return dataSources.conferences.getConference(id);
    }
  },
};