/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
module.exports = function (app) {
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const bookSchema = new mongoose.Schema({
  title: {type: String, required: true },
  comments: [{type: String}],
  commentcount: {type: Number}
});
const Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({});
        const result = books.map(book => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          };
        });
        res.json(result);
    })

    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        return res.send('missing required field title');
      }else {
        const newBook = new Book({ title });
        await newBook.save();
        res.json({
          _id: newBook._id,
          title: newBook.title
        });

      }

    })

    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      const books = await Book.deleteMany({})
      if(books) {
        return res.send('complete delete successful')
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = await Book.findById(bookid);
      if (!book) {
        return res.send('no book exists');
      } else {
        res.json({
          _id: bookid, // Use the bookid variable
          title: book.title,
          comments: book.comments
        });
      }
    })

    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) {
        return res.send('missing required field comment');
      }
        const book = await Book.findById(bookid);
        if(!book) {
          return res.send('no book exists')
        }else {
          book.comments.push(comment);
          await book.save();
          res.json({
            _id: bookid,
            title: book.title,
            comments: book.comments
          })
        }

    })

    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const book = await Book.findById(bookid);
      if(!book) {
        return res.send('no book exists');
      }else {
        await Book.findByIdAndRemove(bookid);
        return res.send('delete successful')
      }
    });

};
