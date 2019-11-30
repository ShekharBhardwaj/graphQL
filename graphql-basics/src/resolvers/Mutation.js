import uuidV4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => {
      return user.email === args.data.email;
    });
    if (emailTaken) {
      throw new Error("Email taken.");
    }

    const user = {
      id: uuidV4(),
      ...args.data
    };

    db.users.push(user);
    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => {
      return user.id === args.id;
    });

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter(comment => {
          return comment.postId !== post.id;
        });
      }

      return !match;
    });

    db.comments = db.comments.filter(comment => {
      return comment.author !== args.id;
    });

    return deletedUsers[0];
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => {
      return user.id === id;
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => {
        return user.email === data.email;
      });

      if (emailTaken) {
        throw new Error("Email taken");
      }
      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== undefined) {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidV4(),
      ...args.data
    };

    db.posts.push(post);
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }
    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => {
      const isAuthor = post.author === args.author;
      const isPostExist = post.id === args.id;
      return isAuthor && isPostExist;
    });
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => {
      return comment.postId !== args.id;
    });

    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
    }
    return deletedPost;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => {
      return post.id === id;
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const originalPost = { ...post };

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      console.log('always true');
      post.published = data.published;
      if(originalPost.published && !post.published){
        // deleted
        pubsub.publish("post", {
          post:{
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if(!originalPost.published && post.published){
        // created
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if(post.published){
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    
    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(post => {
      return args.data.postId === post.id && post.published;
    });

    if (!userExists || !postExists) {
      throw new Error("Post not found");
    }

    const comment = {
      id: uuidV4(),
      ...args.data
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.postId}`, { comment:{
      mutation: 'CREATED',
      data: comment
    } });
    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(comment => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1);
   console.log(deletedComment.postId);
    pubsub.publish(`comment ${deletedComment.postId}`, {
      comment : {
        mutation: 'DELETED',
        data: deletedComment
      }
    });
    return deletedComment;
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => {
      return comment.id === id;
    });
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.postId}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment;
  }
};

export { Mutation as default };
