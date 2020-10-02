const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Client');
const Order = require('../models/Order');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});


const createToken = (user,secret,expiresIn) =>{
    const {id} = user;

    return jwt.sign({id}, secret, {expiresIn})

}

const resolvers = {
    Query:{
        getUser: async (_,{ token }) => {
            const userId = await jwt.verify(token, process.env.SECRET);

            return userId;
        },
        getProducts: async () => {
            try {
                const products = Product.find({});

                return products;
            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        getProduct: async (_,{ id }) => {
          
            const product = await Product.findById(id);

            if(!product){
                throw new Error('Product Not Found..');
            }

            return product;
     
        },
        getClients: async () => {
            try {
                const clients = Client.find({});

                return clients;
            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        getClientsVendor: async (_,{}, ctx) => {
            const userId = ctx.user.id.toString();
            try {
                const clients = Client.find({vendor:userId});

                return clients;
            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        getClient: async (_,{id},ctx) => {
            const client = await Client.findById(id);

            if(!client){
                throw new Error('Client Not Found..');
            }

            if(client.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for view client..')
            }

            return client;
        },
        getOrders: async () =>{
            try {
                const orders = Order.find({});

                return orders;
            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        getOrdersVendor: async (_,{},ctx) =>{
            const userId = ctx.user.id.toString();
            try {
                const orders = Order.find({vendor:userId});

                return orders;
            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        getOrder: async (_,{id},ctx) => {
            const order = await Order.findById(id);

            if(!order){
                throw new Error('Order Not Found..');
            }

            if(order.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for view order..')
            }

            return order;
        },
        getOrderStatus: async (_,{status},ctx) =>{
            const userId = ctx.user.id.toString();
            try {
                const orders = Order.find({vendor:userId, status});

                return orders;
            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        topClients: async () =>{
            const clients = await Order.aggregate([
                { $match: { status: "completed"}},
                { $group:{
                    _id:"$client",
                    total: {$sum:'$total'}
                }},
                {
                    $lookup:{
                        from:'clients',
                        localField:'_id',
                        foreignField:'_id',
                        as: 'client'
                    }
                },{
                    $sort:{total: -1}
                }
            ]);

            return clients;
        },
        topVendors: async () =>{
            const vendors = await Order.aggregate([
                { $match: { status: "completed"}},
                { $group:{
                    _id:"$vendor",
                    total: {$sum:'$total'}
                }},
                {
                    $lookup:{
                        from:'users',
                        localField:'_id',
                        foreignField:'_id',
                        as: 'vendor'
                    }
                },
                {
                    $limit: 3
                },
                {
                    $sort:{total: -1}
                }
            ]);

            return vendors;
        },
        searchProduct: async (_,{text}) =>{
            const products = await Product.find({ $text: { $search: text}}).limit(10);

            return products;
        }
        
    },
    Mutation:{
        newUser: async (_,{ input }) => {
            const { email,password} = input;

            const existingUser = await User.findOne({email});

            if(existingUser){
                throw new Error('User registred..')
            }

            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try {
                const user = new User(input);
                await user.save();

                return user;
            } catch (error) {
                console.log('error --->', error);
            }
        },
        authUser: async (_,{ input }) =>{
            const { email,password} = input;

            const existingUser = await User.findOne({email});

            if(!existingUser){
                throw new Error('User Not Exiting..')
            }

            const passwordCorrect = await bcryptjs.compare(password, existingUser.password);
            if(!passwordCorrect){
                throw new Error('Password Incorrect..')
            }

            return {
                token: createToken(existingUser, process.env.SECRET,'24h')
            }

        },
        newProduct: async (_,{ input }) =>{
            try {
                const product = new Product(input);
                const result = await product.save();

                return result;

            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        updateProduct: async (_,{id, input }) => {

            let product = await Product.findById(id);

            if(!product){
                throw new Error('Product Not Found..');
            }

            product = await Product.findOneAndUpdate({_id:id}, input, {new: true});

            return product;
        },
        deleteProduct: async (_,{ id }) => {
            let product = await Product.findById(id);

            if(!product){
                throw new Error('Product Not Found..');
            }

            await Product.findOneAndDelete({_id:id});

            return 'Product Deleted..';
        },
        newClient: async (_, {input}, context) =>{
            const { email } = input;

            const extingClient = await Client.findOne({email});
            if(extingClient){
                throw new Error('Client existing...');
            }

            const client = new Client(input);

            client.vendor = context.user.id;

            try {

                const result = await client.save();
    
                return result;      

            } catch (error) {
                console.log('Error >>>', error);
            }
        },
        updateClient: async (_,{id, input }, ctx) => {

            let client = await Client.findById(id);

            if(!client){
                throw new Error('Client Not Found..');
            }

            if(client.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for edit client..')
            }

            client = await Client.findOneAndUpdate({_id:id}, input, {new: true});

            return client;
        },
        deleteClient: async (_,{ id }, ctx) => {
            let client = await Client.findById(id);

            if(!client){
                throw new Error('Client Not Found..');
            }
            
            if(client.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for delete client..')
            }

            await Client.findOneAndDelete({_id:id});

            return 'Client Deleted..';
        },
        newOrder: async (_,{ input }, ctx) => {

            const { client } = input;

            const client_ = await Client.findById(client);
            if(!client_){
                throw new Error('Client not existing...');
            }

            if(client_.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for create orders to client..')
            }

            for await (const item of input.order){
                const { id } = item;
                const product = await Product.findById(id);

                if(item.quantity > product.stock){
                    throw new Error(`The product ${product.name} exceeds quantity available !`)
                }else{
                    // update stock product
                    product.stock = product.stock - item.quantity;

                    await product.save()
                }
            }

            const order = new Order(input);

            order.vendor = ctx.user.id;

            try {

                const result = await order.save();
    
                return result;      

            } catch (error) {
                console.log('Error >>>', error);
            }

        },
        updateOrder: async (_,{id, input }, ctx) => {
            // validate order
            let order = await Order.findById(id);

            if(!order){
                throw new Error('Order Not Found..');
            }
            // validate client
            const {client} = input;
            let client_ = await Client.findById(client);

            if(!client_){
                throw new Error('Client Not Found..');
            }

            // validate stock
            if(input.order){
                for await (const item of input.order){
                    const { id } = item;
                    const product = await Product.findById(id);
    
                    if(item.quantity > product.stock){
                        throw new Error(`The product ${product.name} exceeds quantity available !`)
                    }else{
                        // update stock product
                        product.stock = product.stock - item.quantity;
    
                        await product.save()
                    }
                }
            }

            // validate vendor and order
            if(order.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for edit order..')
            }

            // update order
            order = await Order.findOneAndUpdate({_id:id}, input, {new: true});

            return order;
        },
        deleteOrder: async (_,{ id }, ctx) => {
            let order = await Order.findById(id);

            if(!order){
                throw new Error('Order Not Found..');
            }
            
            if(order.vendor.toString() !== ctx.user.id){
                throw new Error('Not permisions for delete order..')
            }

            await Order.findOneAndDelete({_id:id});

            return 'Order Deleted..';
        }
    }
}

module.exports = resolvers;