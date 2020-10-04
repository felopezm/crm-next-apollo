const { gql } = require('apollo-server');

//schema
const typeDefs = gql`
    # ------- Type -------

    type User {
        id: ID
        email: String
        full_name: String
        date_creation: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        stock: Int
        price: Float
        date_creation: String
    }

    type Client {
        id: ID
        full_name: String
        email: String
        company: String
        telephone: String
        vendor: ID
    }

    type Order {
        id: ID
        order: [GroupOrder]
        total: Float
        client: ID
        vendor: ID
        date_creation: String
        status: StatusOrder
    }

    type GroupOrder {
        id: ID
        quantity: Int
    }

    type TopClient {
        total: Float
        client: [Client]
    }

    type TopVendor {
        total: Float
        vendor: [User]
    }



    # ------- Input -------

    input UserInput {
        email: String!
        full_name: String!
        password: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        stock: Int!
        price: Float!
    }

    input ClientInput {
        full_name: String!
        email: String!
        company: String!
        telephone: String
    }

    input OrderProductInput{
        id: ID
        quantity: Int
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float!
        client: ID!
        status: StatusOrder
    }

    # ------- Enum -------

    enum StatusOrder {
        pending
        completed
        canceled
    }

    # ------- Query -------

    type Query {
        # Users
        getUser: User

        # Products
        getProducts: [Product]
        getProduct(id: ID!): Product

        # clients
        getClients: [Client]
        getClientsVendor: [Client]
        getClient(id: ID!): Client

        # orders
        getOrders: [Order]
        getOrdersVendor: [Order]
        getOrder(id:ID!): Order
        getOrderStatus(status:String!): [Order]

        # advance searchs
        topClients: [TopClient]
        topVendors: [TopVendor]
        searchProduct(text: String!): [Product]
    }

    # ------- Mutation -------

    type Mutation {
        # users
        newUser(input: UserInput) : User
        authUser(input: AuthInput): Token

        # products
        newProduct(input: ProductInput) : Product
        updateProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String

        # clients
        newClient(input: ClientInput): Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id:ID!): String

        # orders
        newOrder(input: OrderInput): Order
        updateOrder(id: ID!, input: OrderInput): Order
        deleteOrder(id: ID!): String
    }
`;

module.exports = typeDefs;