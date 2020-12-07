const { RESTDataSource } = require('apollo-datasource-rest');

class ConferenceDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://inspirehep.net/api/conferences/';
  }

  async getConference(conference_id) {
    const object = await this.get(`${conference_id}`);
    return {
      id: conference_id,
      name: "" + object.metadata.titles[0].title
    }
  }
  
}

module.exports = {ConferenceDataSource}