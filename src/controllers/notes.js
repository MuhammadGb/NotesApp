
const Note = require('../models/noteModels');


const noteExists = async (req, res, next) => {
  const notes = req.body.content;

  if (notes === undefined) {
    const err = new Error("Notes content not found");
    err.statusCode = 404;
    next(err);
  }
    next();
};



// Create and Save a new Note
const create = async (req, res,next) => {

        try {
          const {title,content} = req.body;

          const newNote = {
          title:  title || "Untitled Note",
            content,
          };
          const addnote = new Note(newNote)
          addnote.save()
          res.status(201).json({ data: newNote });
        } catch (error) {
          next(error);
        }
};

// Retrieve and return all notes from the database.
const findAll = async (req, res,next) => {

    const fetchNotes =  await Note.find()
                        .then(data => res.json({ data }))
                        .catch(error => next(error));
};

// Find a single note with a noteId
const findOne = async (req, res,next) => {

    try {
    const findNoteById = await Note.findById(req.params.id)
    console.log(findNoteById);
        if(!findNoteById) {
            return  res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
         res.send(findNoteById);

    } catch (error) {
        if(error.kind === 'ObjectId') {
            return  res.status(404).send({
                message: "Note was not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
      next(error);
    }
};

// Update a note identified by the noteId in the request
const updateNote = async(req, res, next) => {

    try {
      const noteID = req.params.noteId;

        const {title,content} = req.body;
            // Find note and update it with the request body
          const updateNote = await Note.findByIdAndUpdate(noteID, {
                title: req.body.title || "Untitled Note",
                content: req.body.content
            }, {new: true})


            if(!updateNote) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
              res.send(updateNote);
    } catch (error) {
      next(error);
    }
};

// Delete a note with the specified noteId in the request
const remove = async (req, res, next) => {

    try {
        const noteID = req.params.id;
        await Note.findByIdAndRemove(noteID)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + noteID
                });
            }
            res.sendStatus(204);
          })
    } catch (error) {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + noteID
            });
        }
        return res.status(500).send({
            message: "Could not delete note with id " + noteID
        });
          next(error);
    };
    }

module.exports = {
  create:[noteExists, create],
  updateNote: [noteExists, updateNote],
  remove,
  findOne,
  findAll
};
