const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      console.log(db.posts);
      return db.posts;
    }

    return db.posts.filter(post => {
      if (
        post.title
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase()) ||
        post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
  },
  me() {
    return {
      id: "000001",
      name: "Ron",
      email: "ron.nik@gmail.com"
    };
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export {
    Query as default
}