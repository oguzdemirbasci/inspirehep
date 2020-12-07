const { gql } = require("apollo-server");

const typeDefs = gql`
    type Conference {
        id: ID!
        name: String
    }

    type Query {
        conference(id: ID!): Conference
    }
`;

module.exports = typeDefs;