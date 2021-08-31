const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const User = require('../../models/user');
const Thought = require('../../models/thought');

router.get('/', async (req, res) => {
    try {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .then(
            users => res.status(200).json(users)
            )
        .catch(err => console.error(err));
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
});

router.get('/:id', async ({params, body}, res) => {
  try {
      User.findOne({ _id: params.id })
      .populate({
          path: 'thoughts',
          select: '-__v'
      })
      .then(
          users => res.status(200).json(users)
          )
      .catch(err => console.error(err));
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        User.create(req.body)
            .then(user => res.status(200).json(user))
            .catch(err => console.error(err));
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
});

router.put('/:id', jsonParser, async ({params, body}, res) => {
    try {
        User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        ).then(user =>{
            if(!user){
                res.status(404).json({message: 'No user found with id!'});
                return;
            }
            res.json(user);
        })
        .catch(err => console.error(err));
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
});

router.delete('/:id', jsonParser, async ({params}, res) => {
    try {
        User.findOneAndDelete({ _id: params.id })
            .then(user => res.json(user))
        .catch(err => console.error(err));
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
});

router.post('/:id/friend/:friendId', async ({params, body}, res) => {
  try {
      User.findOneAndUpdate(
          { _id: params.id },
          { $push: { friends: params.friendId } },
          { new: true, runValidators: true }
      )
      .then( dbUserData => {
          if(!dbUserData){
              res.status(404).json({message: "No user found with this id!"});
              return;
          }
          //res.json(dbUserData);
      });
      
      User.findOneAndUpdate(
        { _id: params.friendId },
        { $push: { friends: params.id } },
        { new: true, runValidators: true }
    )
    .then( dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: "No user found with this id!"});
            return;
        }
        res.json(dbUserData);
    });
  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

router.delete('/:id/friend/:friendId', async ({params, body}, res) => {
  try {
      User.findOneAndUpdate(
          { _id: params.id },
          { $pull: { friends: params.friendId } },
          { new: true }
      )
      .then( dbUserData => {
          if(!dbUserData){
              res.status(404).json({message: "No user found with this id!"});
              return;
          }
          //res.json(dbUserData);
      });

      User.findOneAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.id } },
          { new: true }
      )
      .then( dbUserData => {
          if(!dbUserData){
              res.status(404).json({message: "No user found with this id!"});
              return;
          }
          res.json(dbUserData);
      });
  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

module.exports = router;
