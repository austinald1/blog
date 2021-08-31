const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Thought = require('../../models/thought');
const User = require('../../models/user');

router.get('/', async (req, res) => {
    try {
        Thought.find({})
        .then(
            thoughts => res.status(200).json(thoughts)
            )
        .catch(err => console.error(err));
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    
router.get('/:id', async ({params, body}, res) => {
    try {
        Thought.findOne({ _id: params.id })
        .then(
            thoughts => res.status(200).json(thoughts)
            )
        .catch(err => console.error(err));
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    router.post('/', jsonParser, async (req, res) => {
        try {
            Thought.create(req.body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                    )
            })
            .then(dbUserData =>{
                console.log(dbUserData);
                if(!dbUserData){
                    res.status(404).json({message: "No user found with this id!"});
                    return;
                }
                res.json(dbUserData);
            })
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    router.put('/:id', jsonParser, async ({params, body}, res) => {
        try {
            Thought.findOneAndUpdate(
                { _id: params.id },
                body,
                { new: true, runValidators: true }
            ).then(thought =>{
                if(!thought){
                    res.status(404).json({message: 'No thought found with id!'});
                    return;
                }
                res.json(thought);
            })
            .catch(err => console.error(err));
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    router.delete('/:id', jsonParser, async ({params}, res) => {
        try {
            Thought.findOneAndDelete({ _id: params.id })
                .then(thought => res.json(thought))
            .catch(err => console.error(err));
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    router.post('/:id/reaction', async ({params, body}, res) => {
        try {
            Thought.findOneAndUpdate(
                { _id: params.id },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            )
            .then( dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            });
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    router.post('/:id/reaction', async ({params, body}, res) => {
        try {
            Thought.findOneAndUpdate(
                { _id: params.id },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            )
            .then( dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            });
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

    router.delete('/:id/reaction/:reactionId', async ({params, body}, res) => {
        try {
            Thought.findOneAndUpdate(
                { _id: params.id },
                { $pull: { reactions: { reactionId: params.reactionId } } },
                { new: true }
            )
            .then(dbThoughtData => res.json(dbThoughtData));
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    });

module.exports = router;