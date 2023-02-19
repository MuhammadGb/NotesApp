const express = require("express");
const auth = require('../middleware/auth');
const router = express.Router();

const { remove, create, findAll, findOne,updateNote } = require("../controllers/notes");

    router.route('/').get(findAll).post(auth.authenticate(), create);

    router.put('/:noteId', auth.authenticate('bearer'),updateNote);

    router.route('/:id').get(findOne).delete(auth.authenticate(), remove);


module.exports = router;
