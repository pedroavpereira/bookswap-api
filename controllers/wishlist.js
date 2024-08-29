const Wishlist = require('../models/Wishlist');

async function create(req, res) {
    try {
        const data = req.body;
        const newWishlist = await Wishlist.create(data);
        res.status(201).json(newWishlist);
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(400).json({ error: err.message || "An unknown error occurred" });
    }
}
// show function:
async function show(req, res) {
    try {
        const userId = parseInt(req.params.user_id);
        const wishlists= await Wishlist.findByUserId(userId);
        res.status(200).json(wishlists);
    } catch (err) {
        console.error("Error fetching wishlists:", err);
        res.status(404).json({ error: err.message || "Wishlists not found" });
    }
}

async function destroy(req, res) {
    try {
        const wishlistId = parseInt(req.params.wishlist_id);
        const wishlist= await Wishlist.findByWishlistId(wishlistId);
        await wishlist.destroy();
        res.status(204).end();
    } catch (err) {
        console.error("Error deleting wishlist:", err);
        res.status(404).json({ error: err.message || "Wishlist not found" });
    }
}

module.exports = { create, show, destroy };
