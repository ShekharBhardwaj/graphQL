const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find(user => {
      return user.id === parent.author;
    });
  },
  postId(parent, args, { db }, info) {
    return db.posts.find(post => {
      return post.id === parent.postId;
    });
  }
};


export {
    Comment as default
}