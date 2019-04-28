import { GraphQLServer } from "graphql-yoga";

const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

const comments = [
  {
    id: '20',
    text: 'blah blah',
    author: '1',
    post: '10'
  },
  {
    id: '21',
    text: 'blah blah blah',
    author: '1',
    post: '10'
  },
  {
    id: '22',
    text: 'blahblahblahblah',
    author: '2',
    post: '11',
  },
  {
    id: '23',
    text: 'blah bleh blah blah',
    author: '3',
    post: '10'
  },
]

const posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: '1',
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: '2'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: false,
  author: '1'
}]

const typeDefs = `
  type Query {
    users(id: ID): [User!]!
    posts(published: Boolean): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

const resolvers = {
  Query: {
    users(parent, args) {
      if(args.id) {
        return users.filter((user) => user.id === args.id)
      }
      return users;
    },
    posts(parent, args) {
      if(args.published) {
        return posts.filter((post) => post.published === args.published)
      } else {
        return posts;
      }
    },
    comments() {
      return comments;
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: true,
      }
    },
  },
  Post: {
    author(parent, args) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args) {
      return comments.filter(comment => comment.post === parent.id) 
    }
  },
  User: {
    posts(parent, args) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args) {
      return posts.find((post) => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log("The serve ris up!")
})