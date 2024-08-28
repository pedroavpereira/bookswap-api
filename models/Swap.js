const db = require("../db/connect");

class Swap {
    constructor({swap_id, user_requesting, collection_requested, user_offered,collection_offered,created_at,status,completed}) {
        this.swap_id = swap_id;
        this.user_requesting = user_requesting;
        this.collection_requested = collection_requested;
        this.user_offered = user_offered;
        this.collection_offered = collection_offered;
        this.created_at = created_at;
        this.status = status;
        this.completed = completed;
    }


    static async create(swapData) {
        const { user_requesting, collection_requested, user_offered} = swapData;
        const created_at = new Date();
    
        const result = await db.query(`INSERT INTO swaps(user_requesting, collection_requested, user_offered) VALUES ($1, $2, $3) RETURNING *`, [user_requesting, collection_requested, user_offered]);
        return new Swap(result.rows[0])
    }

    static async update(swap_id, { collection_offered, status }) {
        const result = await db.query(`UPDATE swaps SET collection_offered = $1, status = $2 WHERE swap_id = $3 RETURNING *`, [collection_offered, status, swap_id])
        return new Swap(result.rows[0])
    }
    
    async destroy() {
        const result = await db.query(`DELETE FROM swaps WHERE swap_id = $1 RETURNING *`, [this.swap_id])
        return result.rows.length > 0;
    }

    static async findByUserId(user_id) {
        const result = await db.query(`SELECT * FROM swaps WHERE user_requesting = $1 OR user_offered = $1`, [user_id])
        return result.rows.map(row => new Swap(row))
    }

    static async findBySwapId(swap_id) {
        const result = await db.query(`SELECT * FROM swaps WHERE swap_id = $1`, [swap_id])

        if(result.rows.length > 0) {
            return new Swap(result.rows[0])
        }else {
            return null
        }
    }
}

module.exports = Swap



