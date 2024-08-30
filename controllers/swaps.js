const Book = require("../models/Book");
const Collection = require("../models/Collection");
const Room = require("../models/Room");
const Swap = require("../models/Swap");

const showMine = async (req, res) => {
  try {
    const user_id = req.user_id;

    const swaps = await Swap.findByUserId(user_id);

    const searchResults = await Promise.all(
      swaps.map(async (swap) => {
        const collectionRequested = await Collection.findById(
          swap.collection_requested
        );
        const bookRequested = await Book.findById(collectionRequested.book_id);

        if (swap.collection_offered) {
          const collectionOffered = await Collection.findById(
            swap.collection_offered
          );
          const bookOffered = await Book.findById(collectionRequested.book_id);

          return {
            ...swap,
            collectionRequested,
            bookRequested,
            collectionOffered,
            bookOffered,
          };
        } else {
          return {
            ...swap,
            collectionRequested,
            bookRequested,
            collectionOffered: null,
            bookOffered: null,
          };
        }
      })
    );

    res.status(200).json(searchResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { collection_id } = req.body;
    const collection = await Collection.findById(collection_id);

    const newSwap = await Swap.create({
      user_requesting: req.user_id,
      collection_requested: collection.collection_id,
      user_offered: collection.user_id,
    });

    res.status(201).json(newSwap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const accept = async (req, res) => {
  try {
    const swap_id = req.params.swap_id;
    const { collection_chosen } = req.body;
    const collection = await Collection.findById(collection_chosen);

    const acceptedSwap = await Swap.update(swap_id, {
      collection_offered: collection.collection_id,
      status: "accepted",
    });

    const newRoom = await Room.create({
      user_1: acceptedSwap.user_offered,
      user_2: acceptedSwap.user_requesting,
      swap_id: acceptedSwap.swap_id,
    });

    res.status(200).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reject = async (req, res) => {
  try {
    const swap_id = req.params.swap_id;

    const rejectedSwap = await Swap.update(swap_id, {
      collection_offered: null,
      status: "rejected",
      completed: true,
    });

    res.status(200).json(rejectedSwap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const complete = async (req, res) => {
  try {
    const swap_id = req.params.swap_id;

    const currentSwap = await Swap.findBySwapId(swap_id);

    const completedSwap = await Swap.update(swap_id, {
      collection_offered: currentSwap.collection_offered,
      status: currentSwap.status,
      completed: true,
    });

    res.status(200).json(completedSwap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const swap_id = req.params.swap_id;

    const swap = await Swap.findBySwapId(swap_id);

    await swap.destroy();

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { create, accept, reject, complete, destroy, showMine };
