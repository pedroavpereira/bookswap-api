const Room = require('../../../models/Room')
const db = require('../../../db/connect')


describe('Room Model', () => {

    describe('create', () => {
        it('should create a row in rooms table, where the row contains: room_id, user_1, user_2, swap_id' , async () => {
            const mockRoomData = {
                room_id: 1,
                user_1: 1,
                user_2: 2,
                swap_id: 5
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockRoomData] });

            const room = await Room.create({ user_1: 1, user_2: 2, swap_id: 5 });

            expect(db.query).toHaveBeenCalledWith(
                "INSERT into chat_rooms (user_1 , user_2, swap) VALUES ($1, $2) RETURNING *;", [1, 2, 5]
            );
            expect(room).toEqual(new Room(mockRoomData));
           
        });

        // it('should throw error if issue when creating a room entry in chat_rooms table', async () => {
        //     jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Unable to create room entry.'));

        //     await expect(Room.create({ user_1: 1, user_2: 2, swap_id: 5 })).rejects.toThrow('Unable to create room entry.');
        // });

        it('should throw error "Error creating room" if issue when creating room entry in chat_rooms table and no message from error object', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []});

            await expect(Room.create({ swap_id: 5 })).rejects.toThrow('Error creating room');
        });
    });


    describe('getRoom', () => {
        it('should obtain a row from chat_rooms table that has a particular room_id' , async () => {
            const mockRoomData = {
                room_id: 1,
                user_1: 1,
                user_2: 2,
                swap_id: 5
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockRoomData] });

            const room = await Room.getRoom(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM chat_rooms WHERE room_id = $1",[1]
            );
            expect(room).toEqual(new Room(mockRoomData));
           
        });

        it('should give null as an output when it cannot obtain a row from chat_rooms table with room_id=1', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []});
            const room = await Room.getRoom(1)
            expect(room).toBe(null);
        });
    });

    describe('getRooms', () => {
        it('should obtain a row from chat_rooms table that has a particular room_id' , async () => {
            const mockRoomData = {
                room_id: 1,
                user_1: 1,
                user_2: 2,
                swap_id: 5
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockRoomData] });

            const room = await Room.getRooms(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM chat_rooms WHERE (user_1 = $1 OR user_2 = $1)",
                [1]
            );
            expect(room).toEqual(new Room(mockRoomData));
           
        });

        it('should return empty array [], when it cannot obtain a row from chat_rooms table with user_id=1', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []});
            const room = await Room.getRooms(1)
            expect(room).toEqual([]);
        });
    });
});