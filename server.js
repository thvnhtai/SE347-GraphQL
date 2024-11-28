var express = require("express");

var { createHandler } = require("graphql-http/lib/use/express");

var { buildSchema } = require("graphql");
var schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    description: String!
  }
  type Query {
    getUser(id: ID!): User
  }
  type Mutation {
    createUser(username: String!, description: String!): User
    updateUser(id: ID!, description: String): User
  }
`);
var users = [];
var idCounter = 1;
var root = {
	hello() {
		return "Hello world!";
	},
	createUser({ username, description }) {
		const user = { id: idCounter++, username, description };
		users.push(user);
		return user;
	},
	updateUser({ id, description }) {
		const user = users.find((user) => user.id == id);
		if (!user) {
			throw new Error("User not found");
		}
		if (description) {
			user.description = description;
		}
		return user;
	},
	getUser({ id }) {
		return users.find((user) => user.id == id);
	},
};
var app = express();
app.all(
	"/graphql",
	createHandler({
		schema: schema,
		rootValue: root,
	})
);
// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
