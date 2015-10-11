# Astronomy To Simple Schema

Convert Astronomy classes to Simple Schemas. Useful as a refactor path and for getting them to work in Autoforms.

__Work in progress.__

### Installation

`meteor add lai:astronomy-simple-schema`

### Usage

```js
Posts = new Mongo.Collection('posts');

Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: {
    title: 'string',
    publishedAt: 'date'
  }
});

// Here's your Simple Schema!
PostsSimpleSchema = Post.getSimpleSchema();

```

### Limitations

Unfortunately, due to the superior awesomeness of Astronomy, a one-to-one mapping of Astronomy to Simple Schema is not really feasible at the moment nor practical when there are nested complex field types and arrays of validators. Therefore, you can pass a plain object into `.getSimpleSchema` to define certain Simple Schema fields that might be too complicated to translate:

```js
Post = Astro.Class({ ... });

PostsSimpleSchema = Post.getSimpleSchema({
  revisions: [new SimpleSchema({
    date: {
      type: Date
    },
    notes: {
      type: String,
      optional: true
    }
  })]
});
```

### Future Work

* [ ] Account for nested complex fields
* [ ] `equal` and `equalTo` validators (Could use `autoValue` but what happens when referencing values of other fields?)
* [ ] Validator function parameters (what happens when referencing the value of another field?)
* [ ] Arrays of validators? (is this even possible given the Ands and Ors)
* [ ] Tests

### Contributing

Any kind of insight, PRs, issues are welcome!
