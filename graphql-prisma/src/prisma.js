import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: 'thisismysupersecrettext'
});

export {
    prisma as default
}

// // prisma.query.users(null, '{id name posts {id title}}').then((data) => {
// //     console.log(JSON.stringify(data, undefined, 2));
// // });

// // prisma.query.comments(null, '{id text author {id name}}').then((data) => {
// //     console.log(JSON.stringify(data, undefined, 2));
// // });

// //prisma.mutation

// // prisma.mutation.updatePost({
// //     data:{
// //         body: "This is updated",
// //         published: true
// //     },
// //     where:{
// //        id: "ck3mbohsd022k0822aknhgbva" 
// //     }
// // }).then((data) => {
// //     console.log(JSON.stringify(data, undefined, 2));
// //     return prisma.query.posts(null, '{ id title body published author { id name }}');
// // }).then((data) => {
// //     console.log(JSON.stringify(data, undefined, 2));
// // });

// // prisma.exists.Post({
// //     id:"ck3mdr39602ro0822unx5bvkt"
// // }).then((exists) => {
// //     console.log(exists);
// // });

// const updatePostForUser = async (postId, data) => {

//     const postExists = await prisma.exists.Post({
//         id: postId
//     });
//     if(!postExists){
//         throw new Error('Post not found');
//     }else{
//         const updatedPost = await prisma.mutation.updatePost({
//             data:{...data},
//             where: {
//                     id: postId
//             }
//         }, '{ id title author { id name email}}');
//         return updatedPost;
//     };
   
// };

// // updatePostForUser('p1', {
// //     title: 'updated for challenge'
// // }).then((user) => {
// //     console.log(JSON.stringify(user, undefined, 2));
// // }).catch((err) => {
// //     console.log(err.message);
// // });

// const createPostForUser = async (authorId, data) => {

//     const userExists =  await prisma.exists.User({
//         id: authorId
//     });
//     if(!userExists){
//         throw new Error ("User not found");
//     } else {
//         const post = await prisma.mutation.createPost({
//             data: {
//                 ...data,
//                 author: {
//                     connect : {
//                         id: authorId
//                     }  
//                 }
//             }
//         }, '{ author {id name email posts {id title published}}}');
//         return post;
//     }
    
// };

// createPostForUser('002', {
//     title: 'User exists challenege',
//     body: 'This better than promise',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
// }).catch((err) => {
//     console.log(err.message);
// });



//prisma.subscription

//prisma.exists