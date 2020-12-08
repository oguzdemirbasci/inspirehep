module.exports = {
  Query: {
    conference: async (_, { control_number }, { dataSources }) => {
      return dataSources.conferences.getConference(control_number);
    },
  },
};
