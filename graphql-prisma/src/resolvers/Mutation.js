import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";
import { request } from 'http';



const Mutation = {
  
  // Create User
  async createUser(parent, args, { prisma }, info) {
    if(args.data.password.length < 8) {
      throw new Error("Password must me 8 characters or longer");
    }
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    const password = await bcrypt.hash(args.data.password, 10);

    if (emailTaken) {
      throw new Error("Email taken.");
    }
    const user = await prisma.mutation.createUser({ 
      data: {
        ... args.data,
        password
      }
    });
    return {
      user,
      token: jwt.sign({ userId: user.id}, 'thisisasecret')
    }
  },

  // Login User
  async loginUser(parent, {data}, { prisma, request }, info) {
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    });

    if(!user) {
      throw new Error('Unable to login'); 
    };

    const isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch){
      throw new Error('Unable to login'); 
    };

    return {
      user,
      token: jwt.sign({ userId: user.id}, 'thisisasecret')

    };

  },

  // Delete User
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("User not found");
    }

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },

  // Update User
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("User not found");
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },

  // Create Post
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return await prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },

  // Delete Post
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!postExists) {
      throw new Error("Unable to delete post");
    }

    if(!postExists){
      throw new Error('Post not found');
    };
    return await prisma.mutation.deletePost({
      where:{
        id: args.id
      }
    }, info);
  },

  // Upate Post
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post(
      {id: args.id,
      author: {
        id:userId
      }});
    const isPublished = await prisma.exists.Post(
      {id: args.id,
        published: true,
      author: {
        id:userId
      }});
      
    if(!postExists){
      throw new Error('Unable to update post');
    };

       
    if(isPublished && args.data.published === false){
      prisma.mutation.deleteManyComments({
        where:{
          postId: {
            id: args.id
          }
        }
      }); 
    };

    return await prisma.mutation.updatePost({
      where:{
        id: args.id
      },
      data: args.data
    }, info);
  },

  //Create Comment
  async createComment(parent, {data}, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: data.postId,
      published: true,
      author: {
        id: userId
      }});
    if(!postExists){
      throw new Error('Unable to create comment');
    };
    return await prisma.mutation.createComment({
      data:{
        text:data.text,
        author: {
          connect : {
            id: userId
          }
        },
        postId:{
          connect:{
            id:data.postId
          }
        }
      }

    }, info);
  },

  // Delete Comment
  async deleteComment(parent, args, { prisma, request}, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if(!commentExists){
        throw new Error("Unable to delete comment");
    };
    
    return await prisma.mutation.deleteComment({ where: {
      id: args.id
    }}, info);
  },

  // Update Comment
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if(!commentExists){
      throw new Error("Unable to update comment");
  };
    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  }
};

export { Mutation as default };
